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
   * Récupérer les derniers échanges formatés pour la page d'accueil.
   *
   * La page d'accueil en demande plusieurs : la colonne de droite affiche
   * autant de cartes qu'elle peut en loger sous le tableau voisin, et ce
   * nombre n'est connu qu'une fois la mise en page mesurée côté client.
   */
  async getRecentEchanges(limit: number): Promise<HomeTradeResponse[]> {
    try {
      const result = await pool.query(QUERIES.GET_RECENT_ECHANGES, [limit]);

      return (result.rows as EchangeWithTeams[]).map((echange) => ({
        id: String(echange.id),
        date: String(echange.date),
        teamA: echange.equipe_source_nom,
        playersA: echange.joueurs_source,
        teamB: echange.equipe_destination_nom,
        playersB: echange.joueurs_destination,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des derniers échanges:', error);
      throw new Error('Erreur lors de la récupération des derniers échanges');
    }
  }

}

export const echangesService = new EchangesService();
