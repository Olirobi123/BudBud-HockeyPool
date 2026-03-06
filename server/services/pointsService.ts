import pool from '../config/database';
import { EquipePoints, EquipePointsWithTeam, Joueur, Equipe } from '../types';
import { QUERIES } from '../models';
import { teamsService } from './teamsService';
import { getCurrentSeason, getCurrentSeasonNumber } from './seasonHelper';
import { NHLClient, SkaterSummary, GoalieSummary } from '@olirobi/nhl_api_client';
import {
  FORWARD_POSITIONS,
  DEFENSE_POSITION,
  GOALIE_POSITION,
  MAX_ACTIVE_FORWARDS,
  MAX_ACTIVE_DEFENSEMEN,
  MAX_ACTIVE_GOALIES,
  calculateGoaliePoints,
} from '../utils/poolRules';

const PAGE_SIZE = 100;

async function fetchAllPages<T>(
  fetchPage: (start: number) => Promise<{ data: T[]; total: number }>,
): Promise<T[]> {
  const first = await fetchPage(0);
  const pages = Math.ceil(first.total / PAGE_SIZE);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) => fetchPage((i + 1) * PAGE_SIZE)),
  );
  return [...first.data, ...rest.flatMap((p) => p.data)];
}

export class PointsService {
  /**
   * Update points for all active teams using 2 bulk NHL API calls
   * instead of one call per player.
   */
  async updateAllTeamPoints(): Promise<{ teamsUpdated: number; season: string; timestamp: string }> {
    const season = getCurrentSeason();
    const seasonId = getCurrentSeasonNumber();
    const teams = await teamsService.getActiveTeams();

    const { rosters, skaterMap, goalieMap } = await this.buildStatMaps(teams, seasonId);
    const teamsUpdated = await this.computeAndPersistTeamPoints(teams, rosters, skaterMap, goalieMap, season);

    return { teamsUpdated, season, timestamp: new Date().toISOString() };
  }

  /**
   * Fetch all rosters and bulk NHL stats in parallel, then build
   * skater/goalie lookup maps with a per-player fallback for any
   * pool player missing from the bulk results.
   */
  private async buildStatMaps(
    teams: Equipe[],
    seasonId: number,
  ): Promise<{ rosters: Joueur[][]; skaterMap: Map<number, SkaterSummary>; goalieMap: Map<number, GoalieSummary> }> {
    const nhlClient = new NHLClient();

    const [rosters, allSkaters, allGoalies] = await Promise.all([
      Promise.all(teams.map((t) => teamsService.getTeamRoster(t.id))),
      fetchAllPages((start) => nhlClient.stats.skaters({ seasonId, limit: PAGE_SIZE, start })),
      fetchAllPages((start) => nhlClient.stats.goalies({ seasonId, limit: PAGE_SIZE, start })),
    ]);

    const skaterMap = new Map<number, SkaterSummary>(allSkaters.map((s) => [s.playerId, s]));
    const goalieMap = new Map<number, GoalieSummary>(allGoalies.map((g) => [g.playerId, g]));

    await this.enrichMissingPlayers(rosters, skaterMap, goalieMap, nhlClient);

    return { rosters, skaterMap, goalieMap };
  }

  /**
   * For each pool player absent from both bulk maps, fetch their stats
   * individually and insert a minimal entry into the appropriate map.
   */
  private async enrichMissingPlayers(
    rosters: Joueur[][],
    skaterMap: Map<number, SkaterSummary>,
    goalieMap: Map<number, GoalieSummary>,
    nhlClient: NHLClient,
  ): Promise<void> {
    const seen = new Set<number>();
    const uniqueMissing = rosters.flat().filter((p) => {
      if (skaterMap.has(p.nhl_player_id) || goalieMap.has(p.nhl_player_id)) return false;
      if (seen.has(p.nhl_player_id)) return false;
      seen.add(p.nhl_player_id);
      return true;
    });

    if (uniqueMissing.length === 0) return;

    const fallbacks = await Promise.all(
      uniqueMissing.map(async (player) => {
        try {
          const stats = await nhlClient.players.get(player.nhl_player_id).stats();
          return { player, stats };
        } catch {
          return { player, stats: null };
        }
      }),
    );

    for (const { player, stats } of fallbacks) {
      if (!stats) continue;
      const sub = stats.featuredStats?.regularSeason?.subSeason;
      if (!sub) continue;

      if (player.position === GOALIE_POSITION) {
        goalieMap.set(player.nhl_player_id, {
          playerId: player.nhl_player_id,
          wins: sub.wins ?? 0,
          shutouts: sub.shutouts ?? 0,
        } as GoalieSummary);
      } else {
        skaterMap.set(player.nhl_player_id, {
          playerId: player.nhl_player_id,
          points: sub.points ?? 0,
        } as SkaterSummary);
      }
    }
  }

  /**
   * Calculate pool points for every team and upsert to the database.
   * Returns the number of teams successfully updated.
   */
  private async computeAndPersistTeamPoints(
    teams: Equipe[],
    rosters: Joueur[][],
    skaterMap: Map<number, SkaterSummary>,
    goalieMap: Map<number, GoalieSummary>,
    season: string,
  ): Promise<number> {
    const skaterPts = (nhlId: number) => skaterMap.get(nhlId)?.points ?? 0;
    const goaliePoolPts = (nhlId: number) => {
      const g = goalieMap.get(nhlId);
      return g ? calculateGoaliePoints(g.wins, g.shutouts) : 0;
    };

    let teamsUpdated = 0;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const roster = rosters[i];
      try {
        // Top 12 forwards by NHL points
        const attaque_points = roster
          .filter((p) => FORWARD_POSITIONS.includes(p.position))
          .map((p) => skaterPts(p.nhl_player_id))
          .sort((a, b) => b - a)
          .slice(0, MAX_ACTIVE_FORWARDS)
          .reduce((sum, pts) => sum + pts, 0);

        // Top 6 defensemen by NHL points
        const defense_points = roster
          .filter((p) => p.position === DEFENSE_POSITION)
          .map((p) => skaterPts(p.nhl_player_id))
          .sort((a, b) => b - a)
          .slice(0, MAX_ACTIVE_DEFENSEMEN)
          .reduce((sum, pts) => sum + pts, 0);

        // Top 2 goalies by pool points (2 per win + 3 per shutout)
        const gardien_points = roster
          .filter((p) => p.position === GOALIE_POSITION)
          .map((p) => ({ player: p, pts: goaliePoolPts(p.nhl_player_id) }))
          .sort((a, b) => b.pts - a.pts)
          .slice(0, MAX_ACTIVE_GOALIES)
          .reduce((sum, g) => sum + g.pts, 0);

        const total_points = attaque_points + defense_points + gardien_points;

        await pool.query(QUERIES.UPSERT_EQUIPE_POINTS, [
          team.id,
          season,
          attaque_points,
          defense_points,
          gardien_points,
          total_points,
        ]);

        teamsUpdated++;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to update points for team ${team.id} (${team.nom}):`, error);
      }
    }

    return teamsUpdated;
  }

  /**
   * Get rankings for a season (all teams, ordered by total_points DESC)
   */
  async getRankings(season?: string): Promise<EquipePointsWithTeam[]> {
    const s = season ?? getCurrentSeason();
    const result = await pool.query(QUERIES.GET_RANKINGS_BY_SEASON, [s]);
    return result.rows;
  }

  /**
   * Get rankings filtered by division
   */
  async getRankingsByDivision(
    division: 'nord' | 'sud',
    season?: string,
  ): Promise<EquipePointsWithTeam[]> {
    const s = season ?? getCurrentSeason();
    const result = await pool.query(QUERIES.GET_RANKINGS_BY_DIVISION, [division, s]);
    return result.rows;
  }

  /**
   * Get points for a single team
   */
  async getTeamPoints(equipeId: number, season?: string): Promise<EquipePoints | null> {
    const s = season ?? getCurrentSeason();
    const result = await pool.query(QUERIES.GET_EQUIPE_POINTS_BY_TEAM, [equipeId, s]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}

export const pointsService = new PointsService();
