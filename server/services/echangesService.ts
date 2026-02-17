import pool from '../config/database';
import {
  Echange, EchangeWithTeams, CreateEchangeRequest, HomeTradeResponse,
} from '../types';
import { QUERIES } from '../models';
import { teamsService } from './teamsService';

/**
 * Parse les détails d'un échange pour extraire les joueurs de chaque équipe
 * Format attendu: "TEAM_A reçoit: player1, player2 | TEAM_B reçoit: player1, player2"
 */
function parseTradeDetails(details: string): { playersA: string[]; playersB: string[] } {
  // Séparer les deux côtés de l'échange par " | "
  const sides = details.split(' | ');

  if (sides.length >= 2) {
    // Extraire les joueurs de chaque côté (après "reçoit: ")
    const extractPlayers = (side: string): string[] => {
      const match = side.match(/reçoit:\s*(.+)/i);
      if (match) {
        return match[1].split(',').map((p) => p.trim()).filter((p) => p.length > 0);
      }
      return [side.trim()];
    };

    return {
      playersA: extractPlayers(sides[0]),
      playersB: extractPlayers(sides[1]),
    };
  }

  // Pas de séparateur "|" trouvé - retourner le texte complet
  return {
    playersA: [details],
    playersB: [],
  };
}

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
        [equipe_source_id, equipe_destination_id, details],
      );
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'échange:', error);
      throw new Error('Erreur lors de la création de l\'échange');
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
      const { playersA, playersB } = parseTradeDetails(echange.details);

      return {
        id: String(echange.id),
        date: new Date(echange.date).toLocaleDateString('fr-CA'),
        teamA: echange.equipe_source_nom,
        playersA,
        teamB: echange.equipe_destination_nom,
        playersB,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier échange:', error);
      throw new Error('Erreur lors de la récupération du dernier échange');
    }
  }

}

export const echangesService = new EchangesService();
