import { NHLClient } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import { QUERIES, TABLES } from '../models';
import { EtatInfo, Last5GameSnapshot } from '../types';

export class EtatService {
  async getEtat(): Promise<Record<number, EtatInfo>> {
    const result = await pool.query<{
      nhl_player_id: number;
      etat: 'hot' | 'cold' | 'normal';
      points_5_matchs: number | null;
      victoires_5_matchs: number | null;
      blanchissages_5_matchs: number | null;
      save_pctg_5_matchs: string | null;
      derniers_matchs: Last5GameSnapshot[];
      last_update: string;
    }>(QUERIES.GET_ALL_ETAT);

    const record: Record<number, EtatInfo> = {};
    for (const row of result.rows) {
      record[row.nhl_player_id] = {
        nhlPlayerId: row.nhl_player_id,
        etat: row.etat,
        points5Matchs: row.points_5_matchs,
        victoires5Matchs: row.victoires_5_matchs,
        blanchissages5Matchs: row.blanchissages_5_matchs,
        savePctg5Matchs: row.save_pctg_5_matchs !== null ? parseFloat(row.save_pctg_5_matchs) : null,
        derniersMatchs: row.derniers_matchs,
        lastUpdate: row.last_update,
      };
    }
    return record;
  }

  async saveEtatSnapshot(): Promise<void> {
    const playersResult = await pool.query<{
      nhl_player_id: number;
      position: string;
    }>(QUERIES.GET_ALL_JOUEURS_WITH_POSITION);

    const nhlClient = new NHLClient();

    type InsertRow = [number, string, number | null, number | null, number | null, number | null, string];

    const classifyPlayer = async (player: { nhl_player_id: number; position: string }): Promise<InsertRow | null> => {
      const stats = await nhlClient.players.get(player.nhl_player_id).stats();
      const last5 = stats.last5Games;
      if (!last5 || last5.length === 0) return null;

      const isGoalie = player.position === 'G';
      const snapshot: Last5GameSnapshot[] = last5.map((g) => ({
        gameDate: g.gameDate,
        opponentAbbrev: g.opponentAbbrev,
        goals: g.goals,
        assists: g.assists,
        points: g.points,
        savePctg: g.savePctg,
        shotsAgainst: g.shotsAgainst,
        goalsAgainst: g.goalsAgainst,
        decision: g.decision,
      }));

      let etat: 'hot' | 'cold' | 'normal';
      let points5Matchs: number | null = null;
      let victoires5Matchs: number | null = null;
      let blanchissages5Matchs: number | null = null;
      let savePctg5Matchs: number | null = null;

      if (isGoalie) {
        const wins = last5.filter((g) => g.decision === 'W').length;
        const shutouts = last5.filter(
          (g) => g.goalsAgainst === 0 && (g.shotsAgainst ?? 0) > 0,
        ).length;
        const totalShots = last5.reduce((s, g) => s + (g.shotsAgainst ?? 0), 0);
        const totalSaves = last5.reduce(
          (s, g) => s + ((g.shotsAgainst ?? 0) - (g.goalsAgainst ?? 0)),
          0,
        );
        savePctg5Matchs = totalShots > 0 ? totalSaves / totalShots : null;
        victoires5Matchs = wins;
        blanchissages5Matchs = shutouts;
        if (wins >= 3) etat = 'hot';
        else if (wins <= 1) etat = 'cold';
        else etat = 'normal';
      } else {
        const totalPts = last5.reduce((s, g) => s + (g.points ?? 0), 0);
        points5Matchs = totalPts;
        if (totalPts >= 5) etat = 'hot';
        else if (totalPts <= 2) etat = 'cold';
        else etat = 'normal';
      }

      return [player.nhl_player_id, etat, points5Matchs, victoires5Matchs, blanchissages5Matchs, savePctg5Matchs, JSON.stringify(snapshot)];
    };

    // Fetch all players in batches of 15 to avoid overwhelming the NHL API
    const CONCURRENCY = 25;
    const allResults: PromiseSettledResult<InsertRow | null>[] = [];
    for (let i = 0; i < playersResult.rows.length; i += CONCURRENCY) {
      const batch = playersResult.rows.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.allSettled(batch.map((player) => classifyPlayer(player)));
      allResults.push(...batchResults);
    }
    const rows = allResults
      .filter((r): r is PromiseFulfilledResult<InsertRow> => r.status === 'fulfilled' && r.value !== null)
      .map((r) => r.value);

    // Transaction: truncate then single bulk insert (removes players no longer in the pool)
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(QUERIES.TRUNCATE_ETAT);
      if (rows.length > 0) {
        const params: (number | string | null)[] = [];
        const valueClauses = rows.map((row, i) => {
          const base = i * 7;
          params.push(...row);
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, NOW())`;
        });
        await client.query(
          `INSERT INTO ${TABLES.ETAT_JOUEURS} (nhl_player_id, etat, points_5_matchs, victoires_5_matchs, blanchissages_5_matchs, save_pctg_5_matchs, derniers_matchs, last_update) VALUES ${valueClauses.join(', ')}`,
          params,
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

export const etatService = new EtatService();
