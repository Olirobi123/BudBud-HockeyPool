import pool from '../config/database';
import { Echange, EchangeWithTeams, CreateEchangeRequest } from '../types';
import { QUERIES } from '../models';
import { teamsService } from './teamsService';

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
   * Créer un nouvel échange
   */
  async createEchange(data: CreateEchangeRequest): Promise<Echange> {
    const { equipe_source_id, equipe_destination_id, details } = data;

    // Validation métier
    if (equipe_source_id === equipe_destination_id) {
      throw new Error('Les équipes source et destination doivent être différentes');
    }

    // Vérifier que les équipes existent
    const sourceExists = await teamsService.teamExists(parseInt(equipe_source_id));
    const destExists = await teamsService.teamExists(parseInt(equipe_destination_id));

    if (!sourceExists) {
      throw new Error('L\'équipe source n\'existe pas');
    }

    if (!destExists) {
      throw new Error('L\'équipe destination n\'existe pas');
    }

    try {
      const result = await pool.query(
        QUERIES.CREATE_ECHANGE,
        [equipe_source_id, equipe_destination_id, details]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'échange:', error);
      throw new Error('Erreur lors de la création de l\'échange');
    }
  }

  /**
   * Récupérer un échange par son ID
   */
  async getEchangeById(id: number): Promise<EchangeWithTeams | null> {
    try {
      const result = await pool.query(
        `${QUERIES.GET_ALL_ECHANGES} AND e.id = $1`,
        [id]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'échange:', error);
      throw new Error('Erreur lors de la récupération de l\'échange');
    }
  }
}

export const echangesService = new EchangesService(); 