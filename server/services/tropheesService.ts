import pool from '../config/database';
import { Trophee, TropheeGagnantWithDetails } from '../types';
import { QUERIES } from '../models';

export class TropheesService {
  /**
   * Récupérer tous les types de trophées
   */
  async getAllTrophees(): Promise<Trophee[]> {
    const result = await pool.query(QUERIES.GET_ALL_TROPHEES);
    return result.rows;
  }

  /**
   * Récupérer tous les gagnants
   */
  async getAllWinners(): Promise<TropheeGagnantWithDetails[]> {
    const result = await pool.query(QUERIES.GET_ALL_WINNERS);
    return result.rows;
  }

  /**
   * Récupérer les gagnants par année
   */
  async getWinnersByYear(year: number): Promise<TropheeGagnantWithDetails[]> {
    const result = await pool.query(QUERIES.GET_WINNERS_BY_YEAR, [year]);
    return result.rows;
  }

  /**
   * Récupérer les trophées d'une équipe
   */
  async getTeamTrophies(teamId: number): Promise<TropheeGagnantWithDetails[]> {
    const result = await pool.query(QUERIES.GET_TEAM_TROPHIES, [teamId]);
    return result.rows;
  }
}

export const tropheesService = new TropheesService();
