import pool from '../config/database';
import { MisAuBallotageWithDetails } from '../types';
import { QUERIES } from '../models';

export class MisAuBallotageService {
  async getAll(): Promise<MisAuBallotageWithDetails[]> {
    const result = await pool.query(QUERIES.GET_ALL_MIS_AU_BALLOTAGE);
    return result.rows;
  }

  async getByTypeAndYear(
    type: number,
    annee: number,
  ): Promise<MisAuBallotageWithDetails[]> {
    const result = await pool.query(QUERIES.GET_MIS_AU_BALLOTAGE_BY_TYPE_AND_YEAR, [
      type,
      annee,
    ]);
    return result.rows;
  }

  async typeExists(typeId: number): Promise<boolean> {
    const result = await pool.query(
      'SELECT id FROM types_repechage WHERE id = $1',
      [typeId],
    );
    return result.rows.length > 0;
  }
}

export const misAuBallotageService = new MisAuBallotageService();
