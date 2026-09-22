import type { PoolClient } from 'pg';
import pool from '../config/database';
import { QUERIES } from '../models';
import { ApiError, DraftProspectSearchResult } from '../types';

interface PickRow {
  id: number;
  equipe_id: number;
  equipe_source_id: number | null;
  joueur_id: number | null;
}

interface NhlSearchHit {
  playerId: string;
  name: string;
  positionCode: string;
  teamAbbrev: string | null;
  lastTeamAbbrev: string | null;
  active: boolean;
}

interface NhlLanding {
  firstName: { default: string };
  lastName: { default: string };
  position: string;
}

// On demande large à l'API puisque les retraités sont retirés ensuite.
const SEARCH_FETCH_LIMIT = 40;
const SEARCH_RESULT_LIMIT = 10;

const NHL_HEADERS = { Accept: 'application/json', 'User-Agent': 'nhl-api-client' };

const apiError = (status: number, message: string): ApiError => ({ status, message });

const normalize = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim();

// L'API NHL ne classe pas par pertinence (« Jake O'Brien » sortait 7e) :
// nom exact d'abord, puis les noms qui contiennent tous les mots tapés.
const relevance = (name: string, query: string): number => {
  const n = normalize(name);
  const q = normalize(query);
  const allWords = q.split(/\s+/).every((w) => n.includes(w));
  return (n === q ? 2 : 0) + (allWords ? 1 : 0);
};

async function withTransaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function lockPick(client: PoolClient, annee: number, rang: number): Promise<PickRow> {
  const result = await client.query<PickRow>(QUERIES.GET_DRAFT_PICK_FOR_UPDATE, [annee, rang]);
  if (result.rows.length === 0) throw apiError(404, `Choix #${rang} introuvable`);
  return result.rows[0];
}

/**
 * Écritures de la régie du draft en direct. Chaque opération garde `repechages`
 * et `equipe_joueurs` synchronisés dans une même transaction.
 */
export class DraftRegieService {
  /**
   * Recherche NHL limitée aux joueurs actifs (repêchés ou sous contrat) — les retraités sont exclus.
   * On ne passe pas `active=true` à l'API : son index marque à tort certains prospects repêchés
   * comme inactifs (Jake O'Brien, SEA 2025). Une équipe LNH actuelle suffit donc à garder un joueur.
   */
  async searchProspects(query: string): Promise<DraftProspectSearchResult[]> {
    if (query.trim().length < 3) return [];
    const url = `https://search.d3.nhle.com/api/v1/search/player?culture=fr-ca&limit=${SEARCH_FETCH_LIMIT}&q=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url, { headers: NHL_HEADERS });
    if (!response.ok) throw apiError(502, `Recherche NHL indisponible (${response.status})`);
    const hits = ((await response.json() as NhlSearchHit[]) ?? [])
      .filter((h) => h.active || h.teamAbbrev !== null);

    const owners = await pool.query<{ nhl_player_id: number; nom: string }>(
      QUERIES.GET_OWNERS_BY_NHL_IDS,
      [hits.map((h) => Number(h.playerId))],
    );
    const ownerByNhlId = new Map(owners.rows.map((r) => [r.nhl_player_id, r.nom.trim()]));

    return hits
      .map((h, i) => ({ h, i, score: relevance(h.name, query) }))
      .sort((a, b) => b.score - a.score || a.i - b.i)
      .slice(0, SEARCH_RESULT_LIMIT)
      .map(({ h }) => ({
      nhlPlayerId: Number(h.playerId),
      nom: h.name,
      position: h.positionCode,
      equipe: h.teamAbbrev ?? h.lastTeamAbbrev,
      proprietaire: ownerByNhlId.get(Number(h.playerId)) ?? null,
    }));
  }

  /** Change l'équipe qui fait un choix ; le joueur déjà choisi suit la nouvelle équipe. */
  async setPickEquipe(annee: number, rang: number, equipeId: number): Promise<void> {
    await withTransaction(async (client) => {
      const equipe = await client.query(QUERIES.GET_ACTIVE_EQUIPE, [equipeId]);
      if (equipe.rows.length === 0) throw apiError(400, 'Équipe inconnue ou inactive');

      const pick = await lockPick(client, annee, rang);
      if (pick.equipe_id === equipeId) return;

      // L'équipe d'origine ne change jamais : c'est elle qui détenait le choix au départ.
      const origine = pick.equipe_source_id ?? pick.equipe_id;
      const source = origine === equipeId ? null : origine;
      await client.query(QUERIES.SET_DRAFT_PICK_EQUIPE, [pick.id, equipeId, source]);

      if (pick.joueur_id !== null) {
        await client.query(QUERIES.MOVE_JOUEUR_EQUIPE, [pick.joueur_id, pick.equipe_id, equipeId]);
      }
    });
  }

  /** Associe un joueur NHL au choix : crée le joueur au besoin et l'ajoute à l'alignement. */
  async setPickJoueur(annee: number, rang: number, nhlPlayerId: number): Promise<void> {
    const response = await fetch(`https://api-web.nhle.com/v1/player/${nhlPlayerId}/landing`, { headers: NHL_HEADERS });
    if (!response.ok) throw apiError(404, `Joueur NHL ${nhlPlayerId} introuvable`);
    const landing = await response.json() as NhlLanding;
    const prenom = landing.firstName.default;
    const nom = landing.lastName.default;

    await withTransaction(async (client) => {
      const pick = await lockPick(client, annee, rang);

      // Même convention que le reste de la BD : codes de position de l'API (L / R pour les ailiers).
      const joueur = (await client.query<{ id: number }>(
        QUERIES.UPSERT_JOUEUR_BY_NHL_ID,
        [nhlPlayerId, nom, prenom, landing.position],
      )).rows[0];

      if (pick.joueur_id === joueur.id) return;

      const owner = await client.query<{ id: number; nom: string }>(QUERIES.GET_JOUEUR_OWNER, [joueur.id]);
      if (owner.rows.length > 0) {
        throw apiError(409, `${prenom} ${nom} appartient déjà à ${owner.rows[0].nom.trim()}`);
      }

      if (pick.joueur_id !== null) {
        await client.query(QUERIES.REMOVE_JOUEUR_FROM_EQUIPE, [pick.joueur_id, pick.equipe_id]);
      }
      await client.query(QUERIES.SET_DRAFT_PICK_JOUEUR, [pick.id, `${prenom} ${nom}`, joueur.id]);
      await client.query(QUERIES.ADD_JOUEUR_TO_EQUIPE, [pick.equipe_id, joueur.id]);
    });
  }

  /** Annule un choix : le joueur quitte l'alignement mais reste dans `joueurs`. */
  async clearPickJoueur(annee: number, rang: number): Promise<void> {
    await withTransaction(async (client) => {
      const pick = await lockPick(client, annee, rang);
      if (pick.joueur_id === null) return;
      await client.query(QUERIES.REMOVE_JOUEUR_FROM_EQUIPE, [pick.joueur_id, pick.equipe_id]);
      await client.query(QUERIES.SET_DRAFT_PICK_JOUEUR, [pick.id, null, null]);
    });
  }
}

export const draftRegieService = new DraftRegieService();
