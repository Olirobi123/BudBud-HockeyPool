import pool from '../config/database';
import { QUERIES } from '../models';
import { InjuryInfo } from '../types';

const ESPN_INJURIES_URL =
  'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/injuries';

interface EspnAthleteEntry {
  athlete: {
    firstName: string;
    lastName: string;
  };
  status: string;
  details?: {
    type?: string;
    returnDate?: string;
    shortComment?: string;
  };
}

interface EspnTeamInjuries {
  team: { displayName: string };
  injuries: EspnAthleteEntry[];
}

interface EspnInjuriesResponse {
  injuries: EspnTeamInjuries[];
}

const STATUT_FR: Record<string, string> = {
  'Injured Reserve': 'Réserve des blessés',
  'IR - Long Term': 'LTIR',
  'Out': 'Absent',
  'Questionable': 'Incertain',
  'Doubtful': 'Peu probable',
  'Suspension': 'Suspension',
};

const TYPE_BLESSURE_FR: Record<string, string> = {
  'Lower Body': 'Bas du corps',
  'Upper Body': 'Haut du corps',
  'Hip': 'Hanche',
  'Shoulder': 'Épaule',
  'Knee': 'Genou',
  'Ankle': 'Cheville',
  'Back': 'Dos',
  'Head': 'Tête',
  'Neck': 'Cou',
  'Concussion': 'Commotion cérébrale',
  'Illness': 'Maladie',
  'Not Injury Related': 'Non lié à une blessure',
  'Lower Leg': 'Jambe inférieure',
  'Upper Leg': 'Cuisse',
  'Thigh': 'Cuisse',
  'Face': 'Visage',
  'Wrist': 'Poignet',
  'Hand': 'Main',
  'Finger': 'Doigt',
  'Arm': 'Bras',
  'Elbow': 'Coude',
  'Foot': 'Pied',
  'Groin': 'Aine',
  'Rib': 'Côte',
  'Ribs': 'Côtes',
  'Oblique': 'Oblique',
  'Abdomen': 'Abdomen',
  'Chest': 'Poitrine',
  'Eye': 'Œil',
  'Ear': 'Oreille',
  'Jaw': 'Mâchoire',
  'Nose': 'Nez',
  'Tooth': 'Dent',
  'Fatigue': 'Fatigue',
  'Personal': 'Raisons personnelles',
};

function translateStatut(value: string): string {
  return STATUT_FR[value] ?? value;
}

function translateTypeBlessure(value: string | null | undefined): string | null {
  if (value == null) return null;
  return TYPE_BLESSURE_FR[value] ?? value;
}

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export class InjuriesService {
  async saveInjuriesSnapshot(): Promise<void> {
    const response = await fetch(ESPN_INJURIES_URL);
    if (!response.ok) {
      throw new Error(`ESPN injuries API error: ${response.status}`);
    }
    const data = (await response.json()) as EspnInjuriesResponse;

    // Load all pool players
    const playersResult = await pool.query<{
      nhl_player_id: number;
      nom: string;
      prenom: string;
    }>(QUERIES.GET_ALL_JOUEURS_FOR_INJURY_MATCH);

    // Build normalized name → nhl_player_id lookup
    const nameLookup = new Map<string, number>();
    for (const row of playersResult.rows) {
      const key = normalizeName(`${row.prenom} ${row.nom}`);
      nameLookup.set(key, row.nhl_player_id);
    }

    // Collect matched injuries
    const matched: Array<{
      nhlPlayerId: number;
      statut: string;
      typeBlessure: string | null;
      commentaire: string | null;
      dateRetour: string | null;
    }> = [];

    for (const teamEntry of data.injuries ?? []) {
      for (const injury of teamEntry.injuries ?? []) {
        const espnKey = normalizeName(
          `${injury.athlete.firstName} ${injury.athlete.lastName}`
        );
        const nhlPlayerId = nameLookup.get(espnKey);
        if (nhlPlayerId === undefined) continue;

        matched.push({
          nhlPlayerId,
          statut: translateStatut(injury.status),
          typeBlessure: translateTypeBlessure(injury.details?.type),
          commentaire: injury.details?.shortComment ?? null,
          dateRetour: injury.details?.returnDate ?? null,
        });
      }
    }

    // Transaction: truncate then bulk insert
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(QUERIES.TRUNCATE_INJURIES);
      for (const entry of matched) {
        await client.query(QUERIES.INSERT_INJURY, [
          entry.nhlPlayerId,
          entry.statut,
          entry.typeBlessure,
          entry.commentaire,
          entry.dateRetour || null,
        ]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getInjuries(): Promise<Record<number, InjuryInfo>> {
    const result = await pool.query<{
      nhl_player_id: number;
      statut: string;
      type_blessure: string | null;
      commentaire: string | null;
      date_retour: string | null;
      last_update: string;
    }>(QUERIES.GET_ALL_INJURIES);

    const record: Record<number, InjuryInfo> = {};
    for (const row of result.rows) {
      record[row.nhl_player_id] = {
        nhlPlayerId: row.nhl_player_id,
        statut: row.statut,
        typeBlessure: row.type_blessure,
        commentaire: row.commentaire,
        dateRetour: row.date_retour,
        lastUpdate: row.last_update,
      };
    }
    return record;
  }
}

export const injuriesService = new InjuriesService();
