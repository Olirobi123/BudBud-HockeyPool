import { Pool } from 'pg';
import { NHLClient, PlayerStatsResponse, PlayerSearchResult } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import { QUERIES } from '../models';
import {
  Joueur, Equipe,
  HistoireEchangeEvent, HistoireRepechageEvent, HistoireBallotageEvent,
  HistoireEvent, PlayerHistoryResponse,
} from '../types';

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

    // TEMPORARY FIX (2026-03-06): NHL search API returns 400 with culture=en-us (library default).
    // Bypassing nhlClient.players.search() and calling the endpoint directly with culture=fr-ca,
    // the only culture currently accepted by search.d3.nhle.com.
    // TODO: Remove once @olirobi/nhl_api_client is updated or NHL fixes the API.
    try {
      const encodedQuery = encodeURIComponent(query.trim());
      const url = `https://search.d3.nhle.com/api/v1/search/player?culture=fr-ca&limit=10&q=${encodedQuery}&active=true`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'nhl-api-client' },
      });
      if (!response.ok) {
        throw new Error(`NHL search API responded with status ${response.status}`);
      }
      const data = await response.json() as PlayerSearchResult[];
      return data ?? [];
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
   * Récupérer l'historique complet d'un joueur dans le pool
   */
  async getPlayerHistory(nhlId: number): Promise<PlayerHistoryResponse> {
    const joueur = await this.getPlayerByNhlId(nhlId);
    if (!joueur) return { joueur_id: null, events: [] };

    const [tradesResult, draftResult, ballotageResult] = await Promise.all([
      this.pool.query(QUERIES.GET_PLAYER_TRADE_HISTORY, [nhlId]),
      this.pool.query(QUERIES.GET_PLAYER_DRAFT_HISTORY, [nhlId]),
      this.pool.query(QUERIES.GET_PLAYER_BALLOTAGE_HISTORY, [nhlId]),
    ]);

    const tradeEvents: HistoireEchangeEvent[] = tradesResult.rows.map((row) => ({
      type: 'echange' as const,
      sort_date: String(row.date),
      id: row.id,
      date: String(row.date),
      statut_confirmer: row.statut_confirmer,
      equipe_source_id: row.equipe_source_id,
      equipe_source_nom: row.equipe_source_nom,
      equipe_destination_id: row.equipe_destination_id,
      equipe_destination_nom: row.equipe_destination_nom,
      joueurs_source: row.joueurs_source ?? [],
      joueurs_destination: row.joueurs_destination ?? [],
    }));

    const draftSortDate = (annee: number, yearOffset: number, month: number, day: number): string => {
      const year = annee + yearOffset;
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      return `${year}-${mm}-${dd}`;
    };

    const draftEvents: HistoireRepechageEvent[] = draftResult.rows.map((row) => ({
      type: 'repechage' as const,
      sort_date: draftSortDate(row.annee, row.sort_year_offset, row.sort_month, row.sort_day),
      id: row.id,
      annee: row.annee,
      round: row.round ?? null,
      rang: row.rang,
      equipe_id: row.equipe_id,
      equipe_nom: row.equipe_nom,
      type_id: row.type_id,
      type_nom: row.type_nom,
    }));

    const ballotageEvents: HistoireBallotageEvent[] = ballotageResult.rows.map((row) => ({
      type: 'ballotage' as const,
      sort_date: draftSortDate(row.annee, row.sort_year_offset, row.sort_month, row.sort_day),
      id: row.id,
      annee: row.annee,
      equipe_id: row.equipe_id,
      equipe_nom: row.equipe_nom,
      type_id: row.type_id,
      type_nom: row.type_nom,
    }));

    const typePriority = (type: HistoireEvent['type']): number => {
      if (type === 'ballotage') return 0;
      if (type === 'repechage') return 1;
      return 2;
    };

    const events: HistoireEvent[] = [
      ...tradeEvents, ...draftEvents, ...ballotageEvents,
    ].sort((a, b) => {
      const dateCompare = a.sort_date.localeCompare(b.sort_date);
      if (dateCompare !== 0) return dateCompare;
      return typePriority(a.type) - typePriority(b.type);
    });

    return { joueur_id: joueur.id, events };
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
