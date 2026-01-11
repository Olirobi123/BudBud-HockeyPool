import pool from '../config/database';
import { Equipe, Echange } from '../types';
import { QUERIES } from '../models';

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
   * Récupérer le roster d'une équipe
   * Note: Retourne un tableau vide pour le moment car la relation n'est pas encore en place
   */
  async getTeamRoster(teamId: number): Promise<any[]> {
    try {
      // TODO: Implémenter la requête DB une fois la colonne equipe_id ajoutée à la table players
      // const result = await pool.query(QUERIES.GET_PLAYERS_BY_TEAM_ID, [teamId]);
      // return result.rows;
      return [];
    } catch (error) {
      console.error('Erreur lors de la récupération du roster:', error);
      throw new Error('Erreur lors de la récupération du roster');
    }
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
