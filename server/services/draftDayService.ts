import pool from '../config/database';
import { QUERIES } from '../models';
import {
  DraftBoardPick,
  DraftDayFlag,
  ListeClassement,
  ListeClassementJoueur,
} from '../types';

const DRAFT_DAY_KEY = 'draft_day';
const PICKS_PER_ROUND = 10;

export class DraftDayService {
  /**
   * Bascule de la page d'accueil, modifiée à la main en BD (api_store, clé `draft_day`).
   */
  async getFlag(): Promise<DraftDayFlag> {
    const result = await pool.query<{ json_response: Partial<DraftDayFlag> }>(
      QUERIES.GET_API_STORE,
      [DRAFT_DAY_KEY],
    );
    const stored = result.rows[0]?.json_response;
    return {
      actif: stored?.actif === true,
      annee: typeof stored?.annee === 'number' ? stored.annee : new Date().getFullYear() + 1,
    };
  }

  async getBoard(annee: number): Promise<DraftBoardPick[]> {
    const result = await pool.query<{
      rang: number;
      round: number;
      equipe_id: number;
      equipe_nom: string;
      equipe_nom_court: string | null;
      source_nom: string | null;
      source_nom_court: string | null;
      joueur: string | null;
      joueur_nhl_id: number | null;
      joueur_position: string | null;
    }>(QUERIES.GET_DRAFT_BOARD, [annee]);

    return result.rows.map((row) => ({
      rang: row.rang,
      round: row.round,
      pickInRound: ((row.rang - 1) % PICKS_PER_ROUND) + 1,
      equipeId: row.equipe_id,
      equipeNom: row.equipe_nom,
      equipeNomCourt: row.equipe_nom_court,
      sourceNom: row.source_nom,
      sourceNomCourt: row.source_nom_court,
      // Une chaîne vide compte comme « pas encore choisi ».
      joueur: row.joueur?.trim() ? row.joueur.trim() : null,
      joueurNhlId: row.joueur_nhl_id,
      joueurPosition: row.joueur_position,
    }));
  }

  async getListes(): Promise<ListeClassement[]> {
    const result = await pool.query<{
      id: number;
      nom: string;
      auteur: string | null;
      publie_le: string | null;
      total: number;
    }>(QUERIES.GET_LISTES_CLASSEMENT);

    return result.rows.map((row) => ({
      id: row.id,
      nom: row.nom,
      auteur: row.auteur,
      publieLe: row.publie_le,
      total: row.total,
    }));
  }

  async getListeJoueurs(listeId: number, annee: number): Promise<ListeClassementJoueur[]> {
    const result = await pool.query<{
      rang: number;
      nom: string;
      position: string;
      equipe_nhl: string | null;
      tier: string | null;
      nhl_player_id: number | null;
      proprietaire_id: number | null;
      proprietaire_nom: string | null;
    }>(QUERIES.GET_LISTE_CLASSEMENT_JOUEURS, [listeId, annee]);

    return result.rows.map((row) => ({
      rang: row.rang,
      nom: row.nom,
      position: row.position,
      equipeNhl: row.equipe_nhl,
      tier: row.tier,
      nhlPlayerId: row.nhl_player_id,
      proprietaire: row.proprietaire_id !== null && row.proprietaire_nom !== null
        ? { id: row.proprietaire_id, nom: row.proprietaire_nom.trim() }
        : null,
    }));
  }
}

export const draftDayService = new DraftDayService();
