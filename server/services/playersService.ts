import { Pool } from 'pg';
import { NHLClient, PlayerStatsResponse, PlayerSearchResult } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import { QUERIES } from '../models';
import { Joueur, Equipe } from '../types';

export class PlayersService {
  private nhlClient: NHLClient;

  private pool: Pool;

  constructor(dbPool: Pool) {
    this.pool = dbPool;
    this.nhlClient = new NHLClient();
  }

  /**
   * Récupérer les détails d'un joueur depuis l'API NHL
   */
  async getAPIPlayerByNHLId(id: string): Promise<PlayerStatsResponse> {
    if (!/^\d+$/.test(id)) {
      throw new Error('ID de joueur invalide');
    }

    try {
      const playerData = await this.nhlClient.players.get(parseInt(id, 10)).stats();
      return playerData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la récupération des données du joueur:', error);
      throw new Error('Erreur lors de la récupération des données du joueur');
    }
  }

  /**
   * Rechercher des joueurs via l'API NHL
   */
  async searchPlayers(query: string): Promise<PlayerSearchResult[]> {
    if (query.trim().length < 2) {
      return [];
    }

    try {
      const response = await this.nhlClient.players.search(query.trim()) as PlayerSearchResult[];
      return response ?? [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la recherche de joueurs:', error);
      throw new Error('Erreur lors de la recherche de joueurs');
    }
  }

  /**
   * Récupérer un joueur de la table locale par son ID interne
   */
  async getPlayerById(id: number): Promise<Joueur | null> {
    try {
      const result = await this.pool.query(QUERIES.GET_JOUEUR_BY_ID, [id]);
      return result.rows.length > 0 ? (result.rows[0] as Joueur) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la récupération du joueur:', error);
      throw new Error('Erreur lors de la récupération du joueur');
    }
  }

  /**
   * Récupérer un joueur de la table locale par son ID NHL
   */
  async getPlayerByNhlId(nhlId: number): Promise<Joueur | null> {
    try {
      const result = await this.pool.query(QUERIES.GET_JOUEUR_BY_NHL_ID, [nhlId]);
      return result.rows.length > 0 ? (result.rows[0] as Joueur) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la récupération du joueur par NHL ID:', error);
      throw new Error('Erreur lors de la récupération du joueur');
    }
  }

  /**
   * Récupérer l'équipe du pool qui possède ce joueur
   */
  async getCurrentTeam(joueurId: number): Promise<Equipe | null> {
    try {
      const result = await this.pool.query(QUERIES.GET_JOUEUR_CURRENT_TEAM, [joueurId]);
      return result.rows.length > 0 ? (result.rows[0] as Equipe) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la récupération de l\'équipe du joueur:', error);
      throw new Error('Erreur lors de la récupération de l\'équipe du joueur');
    }
  }

  /**
   * Récupérer l'équipe propriétaire d'un joueur par son NHL ID
   */
  async getOwnershipByNhlId(nhlId: number): Promise<Equipe | null> {
    try {
      const joueur = await this.getPlayerByNhlId(nhlId);
      if (!joueur) {
        return null;
      }
      return await this.getCurrentTeam(joueur.id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erreur lors de la récupération de la propriété du joueur:', error);
      throw new Error('Erreur lors de la récupération de la propriété du joueur');
    }
  }
}

export const playersService = new PlayersService(pool);
