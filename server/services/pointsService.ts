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

    await this.snapshotPreviousClassement(season);

    const teams = await teamsService.getActiveTeams();

    const { rosters, skaterMap, goalieMap } = await this.buildStatMaps(teams, seasonId);
    const teamsUpdated = await this.computeAndPersistTeamPoints(teams, rosters, skaterMap, goalieMap, season);

    return { teamsUpdated, season, timestamp: new Date().toISOString() };
  }

  /**
   * Snapshot current equipe_points totals into api_store key `classement_prev`
   * before running the NHL API update, so snapshotService can compute daily diffs.
   */
  async snapshotPreviousClassement(season: string): Promise<void> {
    try {
      const result = await pool.query(QUERIES.GET_CURRENT_EQUIPE_POINTS_ALL, [season]);
      const teams: Record<string, number> = {};
      for (const row of result.rows as { equipe_id: number; total_points: number }[]) {
        teams[String(row.equipe_id)] = row.total_points;
      }
      await pool.query(QUERIES.UPSERT_API_STORE, [
        'classement_prev',
        { updatedAt: new Date().toISOString(), teams },
      ]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to snapshot classement_prev:', error);
    }
  }

  /**
   * Set compte_points = true for all active top-roster players (top 12F / 6D / 2G
   * across all teams), and false for everyone else.
   */
  private async updateComptePoints(activeNhlIds: number[]): Promise<void> {
    try {
      await pool.query(QUERIES.UPDATE_COMPTE_POINTS, [activeNhlIds]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update compte_points:', error);
    }
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
      fetchAllPages((start) => nhlClient.stats.skaters({ seasonId, limit: PAGE_SIZE, start, sort: 'playerId', direction: 'ASC' })),
      fetchAllPages((start) => nhlClient.stats.goalies({ seasonId, limit: PAGE_SIZE, start, sort: 'playerId', direction: 'ASC' })),
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
    const currentSeasonNum = getCurrentSeasonNumber();
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

      // Filter to current NHL regular season only — same logic as teamsService.
      // Using featuredStats here would return last season's stats for players
      // who haven't played yet this season (e.g. injured since preseason).
      const currentSeasonEntries = stats.seasonTotals?.filter(
        (s) => s.leagueAbbrev === 'NHL' && s.gameTypeId === 2 && s.season === currentSeasonNum,
      ) ?? [];

      if (player.position === GOALIE_POSITION) {
        goalieMap.set(player.nhl_player_id, {
          playerId: player.nhl_player_id,
          wins: currentSeasonEntries.reduce((sum, s) => sum + (s.wins ?? 0), 0),
          shutouts: currentSeasonEntries.reduce((sum, s) => sum + (s.shutouts ?? 0), 0),
          gamesPlayed: currentSeasonEntries.reduce((sum, s) => sum + (s.gamesPlayed ?? 0), 0),
        } as GoalieSummary);
      } else {
        skaterMap.set(player.nhl_player_id, {
          playerId: player.nhl_player_id,
          points: currentSeasonEntries.reduce((sum, s) => sum + (s.points ?? 0), 0),
          gamesPlayed: currentSeasonEntries.reduce((sum, s) => sum + (s.gamesPlayed ?? 0), 0),
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
    // pts desc, PPM desc (tiebreaker), nhl_player_id asc (deterministic final tiebreaker)
    const byPts = (a: { pts: number; ppm: number; player: Joueur }, b: { pts: number; ppm: number; player: Joueur }) =>
      b.pts - a.pts || b.ppm - a.ppm || a.player.nhl_player_id - b.player.nhl_player_id;

    let teamsUpdated = 0;
    const activeNhlIds: number[] = [];

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      const roster = rosters[i];
      try {
        const forwards = roster
          .filter((p) => FORWARD_POSITIONS.includes(p.position))
          .map((p) => {
            const s = skaterMap.get(p.nhl_player_id);
            const pts = s?.points ?? 0;
            const gp = s?.gamesPlayed ?? 0;
            return { player: p, pts, ppm: gp > 0 ? pts / gp : 0, gp, goals: s?.goals ?? 0 };
          })
          .sort(byPts)
          .slice(0, MAX_ACTIVE_FORWARDS);

        const defense = roster
          .filter((p) => p.position === DEFENSE_POSITION)
          .map((p) => {
            const s = skaterMap.get(p.nhl_player_id);
            const pts = s?.points ?? 0;
            const gp = s?.gamesPlayed ?? 0;
            return { player: p, pts, ppm: gp > 0 ? pts / gp : 0, gp, goals: s?.goals ?? 0 };
          })
          .sort(byPts)
          .slice(0, MAX_ACTIVE_DEFENSEMEN);

        const goalies = roster
          .filter((p) => p.position === GOALIE_POSITION)
          .map((p) => {
            const g = goalieMap.get(p.nhl_player_id);
            const pts = g ? calculateGoaliePoints(g.wins, g.shutouts) : 0;
            const gp = g?.gamesPlayed ?? 0;
            return { player: p, pts, ppm: gp > 0 ? pts / gp : 0, gp };
          })
          .sort(byPts)
          .slice(0, MAX_ACTIVE_GOALIES);

        const attaque_points = forwards.reduce((sum, e) => sum + e.pts, 0);
        const defense_points = defense.reduce((sum, e) => sum + e.pts, 0);
        const gardien_points = goalies.reduce((sum, e) => sum + e.pts, 0);
        const total_points = attaque_points + defense_points + gardien_points;

        const attaque_matchs = forwards.reduce((sum, e) => sum + e.gp, 0);
        const defense_matchs = defense.reduce((sum, e) => sum + e.gp, 0);
        const gardien_matchs = goalies.reduce((sum, e) => sum + e.gp, 0);
        const total_matchs = attaque_matchs + defense_matchs + gardien_matchs;

        const total_buts = forwards.reduce((sum, e) => sum + e.goals, 0) + defense.reduce((sum, e) => sum + e.goals, 0);

        forwards.forEach((e) => activeNhlIds.push(e.player.nhl_player_id));
        defense.forEach((e) => activeNhlIds.push(e.player.nhl_player_id));
        goalies.forEach((e) => activeNhlIds.push(e.player.nhl_player_id));

        await pool.query(QUERIES.UPSERT_EQUIPE_POINTS, [
          team.id,
          season,
          attaque_points,
          defense_points,
          gardien_points,
          total_points,
          total_buts,
          total_matchs,
          attaque_matchs,
          defense_matchs,
          gardien_matchs,
        ]);

        teamsUpdated++;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to update points for team ${team.id} (${team.nom}):`, error);
      }
    }

    await this.updateComptePoints(activeNhlIds);

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
