import { NHLClient, PlayerStatsResponse } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import {
  Equipe,
  Echange,
  Joueur,
  RosterPlayerWithStats,
  SkaterStats,
  GoalieStats,
  TeamDraftPick,
} from '../types';
import { QUERIES } from '../models';
import { getCurrentSeasonNumber } from './seasonHelper';

/**
 * Extract relevant stats from NHL API response based on player position.
 * Only returns stats from NHL regular season (filters out AHL, etc.)
 */
function extractStats(
  statsResponse: PlayerStatsResponse,
  position: string,
): SkaterStats | GoalieStats {
  // Filter for current NHL regular season only
  // gameTypeId 2 = regular season, leagueAbbrev 'NHL' = NHL league
  const currentSeasonNum = getCurrentSeasonNumber();
  const currentSeasonEntries = statsResponse.seasonTotals?.filter(
    (s) =>
      s.leagueAbbrev === 'NHL' &&
      s.gameTypeId === 2 &&
      s.season === currentSeasonNum,
  );

  // Return zeros if no current season data found
  if (!currentSeasonEntries || currentSeasonEntries.length === 0) {
    if (position === 'G') {
      return { gamesPlayed: 0, savePctg: 0, goalsAgainstAvg: 0, wins: 0, shutouts: 0 };
    }
    return { gamesPlayed: 0, goals: 0, assists: 0, points: 0 };
  }

  if (position === 'G') {
    const totalGP = currentSeasonEntries.reduce((sum, s) => sum + (s.gamesPlayed ?? 0), 0);
    const totalWins = currentSeasonEntries.reduce((sum, s) => sum + (s.wins ?? 0), 0);
    // Weighted average for rate stats
    const totalShotsAgainst = currentSeasonEntries.reduce((sum, s) => sum + (s.shotsAgainst ?? 0), 0);
    const totalGoalsAgainst = currentSeasonEntries.reduce((sum, s) => sum + (s.goalsAgainst ?? 0), 0);
    const savePctg = totalShotsAgainst > 0
      ? (totalShotsAgainst - totalGoalsAgainst) / totalShotsAgainst
      : 0;
    const goalsAgainstAvg = totalGP > 0
      ? (totalGoalsAgainst / totalGP) * 60 / 60
      : 0;
    const totalShutouts = currentSeasonEntries.reduce((sum, s) => sum + (s.shutouts ?? 0), 0);
    return { gamesPlayed: totalGP, savePctg, goalsAgainstAvg, wins: totalWins, shutouts: totalShutouts };
  }

  return {
    gamesPlayed: currentSeasonEntries.reduce((sum, s) => sum + (s.gamesPlayed ?? 0), 0),
    goals: currentSeasonEntries.reduce((sum, s) => sum + (s.goals ?? 0), 0),
    assists: currentSeasonEntries.reduce((sum, s) => sum + (s.assists ?? 0), 0),
    points: currentSeasonEntries.reduce((sum, s) => sum + (s.points ?? 0), 0),
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
            teamLogo: stats.teamLogo,
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Erreur lors de la récupération des stats pour le joueur ${player.id}:`, error);
          return {
            ...player,
            nhlStats: null,
            teamLogo: undefined,
          };
        }
      }),
    );

    // Mark active players: top 12 forwards and top 6 defensemen by points
    const FORWARD_POSITIONS = ['C', 'L', 'R'];
    const MAX_ACTIVE_FORWARDS = 12;
    const MAX_ACTIVE_DEFENSEMEN = 6;

    const getPoints = (player: RosterPlayerWithStats): number => {
      if (player.nhlStats && 'points' in player.nhlStats) {
        return player.nhlStats.points;
      }
      return 0;
    };

    const forwards = enrichedRoster
      .filter((p) => FORWARD_POSITIONS.includes(p.position))
      .sort((a, b) => getPoints(b) - getPoints(a))
      .map((p, index) => ({ ...p, isActive: index < MAX_ACTIVE_FORWARDS }));

    const defensemen = enrichedRoster
      .filter((p) => p.position === 'D')
      .sort((a, b) => getPoints(b) - getPoints(a))
      .map((p, index) => ({ ...p, isActive: index < MAX_ACTIVE_DEFENSEMEN }));

    const MAX_ACTIVE_GOALIES = 2;

    const getGoaliePoolPoints = (player: RosterPlayerWithStats): number => {
      if (player.nhlStats && 'wins' in player.nhlStats) {
        return player.nhlStats.wins * 2 + player.nhlStats.shutouts * 3;
      }
      return 0;
    };

    const goalies = enrichedRoster
      .filter((p) => p.position === 'G')
      .sort((a, b) => getGoaliePoolPoints(b) - getGoaliePoolPoints(a))
      .map((p, index) => ({ ...p, isActive: index < MAX_ACTIVE_GOALIES }));

    return [...forwards, ...defensemen, ...goalies];
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

  /**
   * Get all teams in a specific division (alphabetically ordered)
   */
  async getTeamsByDivision(division: 'nord' | 'sud'): Promise<Equipe[]> {
    try {
      const result = await pool.query(QUERIES.GET_TEAMS_BY_DIVISION, [division]);
      return result.rows;
    } catch (error) {
      console.error(`Erreur lors de la récupération des équipes de la division ${division}:`, error);
      throw new Error(`Erreur lors de la récupération des équipes de la division ${division}`);
    }
  }

  /**
   * Get division standings (alphabetically ordered, not stats-based)
   * Rank is simply the position in the alphabetical list
   */
  async getDivisionStandings(division: 'nord' | 'sud'): Promise<{ id: number; nom: string; division: 'nord' | 'sud'; rank: number; dg_name?: string }[]> {
    try {
      const teams = await this.getTeamsByDivision(division);

      // Assign ranks based on alphabetical position (1, 2, 3...)
      return teams.map((team, index) => ({
        id: team.id,
        nom: team.nom,
        division: division,
        rank: index + 1,
        dg_name: team.dg_name,
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération du classement de la division ${division}:`, error);
      throw new Error(`Erreur lors de la récupération du classement de la division ${division}`);
    }
  }

  /**
   * Récupérer les choix de repêchage futurs d'une équipe
   */
  async getTeamDraftPicks(teamId: number): Promise<TeamDraftPick[]> {
    try {
      const result = await pool.query(QUERIES.GET_TEAM_DRAFT_PICKS, [teamId]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des choix de repêchage:', error);
      throw new Error('Erreur lors de la récupération des choix de repêchage');
    }
  }

  /**
   * Get all inactive teams
   */
  async getInactiveTeams(): Promise<Equipe[]> {
    try {
      const result = await pool.query(QUERIES.GET_INACTIVE_TEAMS);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des équipes inactives:', error);
      throw new Error('Erreur lors de la récupération des équipes inactives');
    }
  }
}

export const teamsService = new TeamsService();
