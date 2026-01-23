import { NHLClient, PlayerStatsResponse } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import {
  Equipe,
  Echange,
  Joueur,
  RosterPlayerWithStats,
  SkaterStats,
  GoalieStats,
} from '../types';
import { QUERIES } from '../models';

/**
 * Extract relevant stats from NHL API response based on player position.
 * Only returns stats from NHL regular season (filters out AHL, etc.)
 */
function extractStats(
  statsResponse: PlayerStatsResponse,
  position: string,
): SkaterStats | GoalieStats {
  // Use seasonTotals to ensure we get NHL stats only
  // gameTypeId 2 = regular season, leagueAbbrev 'NHL' = NHL league
  const nhlSeasons = statsResponse.seasonTotals?.filter(
    (s) => s.leagueAbbrev === 'NHL' && s.gameTypeId === 2,
  );

  // Return zeros if no NHL season found
  if (!nhlSeasons || nhlSeasons.length === 0) {
    if (position === 'G') {
      return { gamesPlayed: 0, savePctg: 0, goalsAgainstAvg: 0, wins: 0 };
    }
    return { gamesPlayed: 0, goals: 0, assists: 0, points: 0 };
  }

  // Get the most recent NHL season (highest season number)
  const currentSeason = nhlSeasons.reduce((latest, current) => {
    const currentSeasonNum = current.season ?? 0;
    const latestSeasonNum = latest.season ?? 0;
    return currentSeasonNum > latestSeasonNum ? current : latest;
  });

  if (position === 'G') {
    return {
      gamesPlayed: currentSeason.gamesPlayed ?? 0,
      savePctg: currentSeason.savePctg ?? 0,
      goalsAgainstAvg: currentSeason.goalsAgainstAvg ?? 0,
      wins: currentSeason.wins ?? 0,
    };
  }

  return {
    gamesPlayed: currentSeason.gamesPlayed ?? 0,
    goals: currentSeason.goals ?? 0,
    assists: currentSeason.assists ?? 0,
    points: currentSeason.points ?? 0,
  };
}

export class TeamsService {
  /**
   * Récupérer toutes les équipes
   */
  async getAllTeams(): Promise<Equipe[]> {
    try {
      const result = await pool.query(QUERIES.GET_ALL_TEAMS);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes:', error);
      throw new Error('Erreur lors de la récupération des équipes');
    }
  }

  /**
   * Récupérer uniquement les équipes actives
   */
  async getActiveTeams(): Promise<Equipe[]> {
    try {
      const result = await pool.query(QUERIES.GET_ACTIVE_TEAMS);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes actives:', error);
      throw new Error('Erreur lors de la récupération des équipes actives');
    }
  }

  /**
   * Récupérer une équipe par son ID
   */
  async getTeamById(id: number): Promise<Equipe | null> {
    try {
      const result = await pool.query(QUERIES.GET_TEAM_BY_ID, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'équipe:', error);
      throw new Error('Erreur lors de la récupération de l\'équipe');
    }
  }

  /**
   * Vérifier si une équipe existe
   */
  async teamExists(id: number): Promise<boolean> {
    const team = await this.getTeamById(id);
    return team !== null;
  }

  /**
   * Récupérer le roster d'une équipe (données DB uniquement)
   */
  async getTeamRoster(teamId: number): Promise<Joueur[]> {
    try {
      const result = await pool.query(QUERIES.GET_TEAM_ROSTER, [teamId]);
      return result.rows as Joueur[];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la récupération du roster:', error);
      throw new Error('Erreur lors de la récupération du roster');
    }
  }

  /**
   * Récupérer le roster d'une équipe avec les stats NHL
   */
  async getTeamRosterWithStats(teamId: number): Promise<RosterPlayerWithStats[]> {
    const roster = await this.getTeamRoster(teamId);
    const nhlClient = new NHLClient();

    const enrichedRoster = await Promise.all(
      roster.map(async (player): Promise<RosterPlayerWithStats> => {
        try {
          const stats = await nhlClient.players.get(player.nhl_player_id).stats();
          return {
            ...player,
            nhlStats: extractStats(stats, player.position),
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Erreur lors de la récupération des stats pour le joueur ${player.id}:`, error);
          return {
            ...player,
            nhlStats: null,
          };
        }
      }),
    );

    return enrichedRoster;
  }

  /**
   * Récupérer le dernier échange d'une équipe
   */
  async getTeamLatestTrade(teamId: number): Promise<Echange | null> {
    try {
      const result = await pool.query(QUERIES.GET_LATEST_TRADE_BY_TEAM, [teamId]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier échange:', error);
      throw new Error('Erreur lors de la récupération du dernier échange');
    }
  }
}

export const teamsService = new TeamsService();
