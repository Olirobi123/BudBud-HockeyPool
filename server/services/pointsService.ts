import pool from '../config/database';
import { EquipePoints, EquipePointsWithTeam, RosterPlayerWithStats } from '../types';
import { QUERIES } from '../models';
import { teamsService } from './teamsService';
import { getCurrentSeason } from './seasonHelper';

const FORWARD_POSITIONS = ['C', 'L', 'R'];
const MAX_ACTIVE_GOALIES = 2;

/**
 * Get skater points from a RosterPlayerWithStats entry.
 */
function getPoints(player: RosterPlayerWithStats): number {
  if (player.nhlStats && 'points' in player.nhlStats) {
    return player.nhlStats.points;
  }
  return 0;
}

/**
 * Get goalie pool points: 2 per win + 3 per shutout.
 */
function getGoaliePoolPoints(player: RosterPlayerWithStats): number {
  if (player.nhlStats && 'wins' in player.nhlStats) {
    return player.nhlStats.wins * 2 + player.nhlStats.shutouts * 3;
  }
  return 0;
}

export class PointsService {
  /**
   * Update points for all active teams.
   * Reuses teamsService.getTeamRosterWithStats() which already handles
   * NHL API fetching, mid-season trade summing, and active player marking.
   */
  async updateAllTeamPoints(): Promise<{ teamsUpdated: number; season: string; timestamp: string }> {
    const season = getCurrentSeason();
    const teams = await teamsService.getActiveTeams();

    let teamsUpdated = 0;

    for (const team of teams) {
      try {
        const roster = await teamsService.getTeamRosterWithStats(team.id);

        const activeForwards = roster.filter(
          (p) => p.isActive && FORWARD_POSITIONS.includes(p.position),
        );
        const activeDefensemen = roster.filter(
          (p) => p.isActive && p.position === 'D',
        );

        const attaque_points = activeForwards.reduce((sum, p) => sum + getPoints(p), 0);
        const defense_points = activeDefensemen.reduce((sum, p) => sum + getPoints(p), 0);

        // Top 2 goalies by pool points (2 per win + 3 per shutout)
        const goalies = roster
          .filter((p) => p.position === 'G')
          .sort((a, b) => getGoaliePoolPoints(b) - getGoaliePoolPoints(a))
          .slice(0, MAX_ACTIVE_GOALIES);
        const gardien_points = goalies.reduce((sum, p) => sum + getGoaliePoolPoints(p), 0);

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
