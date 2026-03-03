import pool from '../config/database';
import {
  EchangeWithTeams, HomeTradeResponse,
} from '../types';
import { QUERIES } from '../models';

export class EchangesService {
  /**
   * Récupérer tous les échanges avec les noms des équipes
   */
  async getAllEchanges(): Promise<EchangeWithTeams[]> {
    try {
      const result = await pool.query(QUERIES.GET_ALL_ECHANGES);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des échanges:', error);
      throw new Error('Erreur lors de la récupération des échanges');
    }
  }

  /**
   * Récupérer le dernier échange formaté pour la page d'accueil
   */
  async getLatestEchange(): Promise<HomeTradeResponse | null> {
    try {
      const result = await pool.query(QUERIES.GET_LATEST_ECHANGE);
      if (result.rows.length === 0) {
        return null;
      }

      const echange = result.rows[0] as EchangeWithTeams;

      return {
        id: String(echange.id),
        date: String(echange.date),
        teamA: echange.equipe_source_nom,
        playersA: echange.joueurs_source,
        teamB: echange.equipe_destination_nom,
        playersB: echange.joueurs_destination,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier échange:', error);
      throw new Error('Erreur lors de la récupération du dernier échange');
    }
  }

}

export const echangesService = new EchangesService();
