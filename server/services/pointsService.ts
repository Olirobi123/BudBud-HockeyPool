import pool from '../config/database';
import { EquipePoints, EquipePointsWithTeam } from '../types';
import { QUERIES } from '../models';
import { teamsService } from './teamsService';
import { getCurrentSeason, getCurrentSeasonNumber } from './seasonHelper';
import { NHLClient, SkaterSummary, GoalieSummary } from '@olirobi/nhl_api_client';
import {
  FORWARD_POSITIONS,
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

    const nhlClient = new NHLClient();
    //Bulk get des points de tout le monde avec pagination
    const [allSkaters, allGoalies] = await Promise.all([
      fetchAllPages((start) => nhlClient.stats.skaters({ seasonId, limit: PAGE_SIZE, start })),
      fetchAllPages((start) => nhlClient.stats.goalies({ seasonId, limit: PAGE_SIZE, start })),
    ]);

    const skaterMap = new Map<number, SkaterSummary>(allSkaters.map((s) => [s.playerId, s]));
    const goalieMap = new Map<number, GoalieSummary>(allGoalies.map((g) => [g.playerId, g]));

    let teamsUpdated = 0;

    for (const team of teams) {
      try {
        const roster = await teamsService.getTeamRoster(team.id);

        const skaterPts = (nhlId: number) => skaterMap.get(nhlId)?.points ?? 0;

        // Top 12 forwards by NHL points
        const attaque_points = roster
          .filter((p) => FORWARD_POSITIONS.includes(p.position))
          .map((p) => skaterPts(p.nhl_player_id))
          .sort((a, b) => b - a)
          .slice(0, MAX_ACTIVE_FORWARDS)
          .reduce((sum, pts) => sum + pts, 0);

        // Top 6 defensemen by NHL points
        const defense_points = roster
          .filter((p) => p.position === 'D')
          .map((p) => skaterPts(p.nhl_player_id))
          .sort((a, b) => b - a)
          .slice(0, MAX_ACTIVE_DEFENSEMEN)
          .reduce((sum, pts) => sum + pts, 0);

        // Top 2 goalies by pool points (2 per win + 3 per shutout)
        const goaliePoolPts = (nhlId: number): number => {
          const g = goalieMap.get(nhlId);
          return g ? calculateGoaliePoints(g.wins, g.shutouts) : 0;
        };
        const goalies = roster.filter((p) => p.position === 'G');
        const activeGoalies = goalies
          .sort((a, b) => goaliePoolPts(b.nhl_player_id) - goaliePoolPts(a.nhl_player_id))
          .slice(0, MAX_ACTIVE_GOALIES);

        const gardien_points = activeGoalies.reduce((sum, p) => sum + goaliePoolPts(p.nhl_player_id), 0);
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

    return {
      teamsUpdated,
      season,
      timestamp: new Date().toISOString(),
    };
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
