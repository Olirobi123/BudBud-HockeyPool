import pool from '../config/database';
import { Trophee, TropheeGagnantWithDetails } from '../types';
import { QUERIES } from '../models';

export class TropheesService {
  async getAllTrophees(): Promise<Trophee[]> {
    try {
      const result = await pool.query(QUERIES.GET_ALL_TROPHEES);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des trophées:', error);
      throw new Error('Erreur lors de la récupération des trophées');
    }
  }

  async getAllWinners(): Promise<TropheeGagnantWithDetails[]> {
    try {
      const result = await pool.query(QUERIES.GET_ALL_WINNERS);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des gagnants:', error);
      throw new Error('Erreur lors de la récupération des gagnants');
    }
  }

  async getWinnersByYear(year: number): Promise<TropheeGagnantWithDetails[]> {
    try {
      const result = await pool.query(QUERIES.GET_WINNERS_BY_YEAR, [year]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des gagnants par année:', error);
      throw new Error('Erreur lors de la récupération des gagnants par année');
    }
  }

  async getTeamTrophies(teamId: number): Promise<TropheeGagnantWithDetails[]> {
    try {
      const result = await pool.query(QUERIES.GET_TEAM_TROPHIES, [teamId]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des trophées de l\'équipe:', error);
      throw new Error('Erreur lors de la récupération des trophées de l\'équipe');
    }
  }
}

export const tropheesService = new TropheesService();
