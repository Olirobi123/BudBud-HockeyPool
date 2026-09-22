import pool from '../config/database';
import { RepechageChoice, RepechageType } from '../types';

export class RepechageService {
  /**
   * Récupérer tous les choix au repêchage
   */
  async getAllChoices(): Promise<RepechageChoice[]> {
    try {
      const result = await pool.query(`
        SELECT 
          r.annee,
          r.type_id, 
          r.rang, 
          r.round, 
          e.nom AS nom,
          r.joueur
        FROM 
          repechages r
        JOIN 
          equipes e ON r.equipe_id = e.id
        ORDER BY 
          r.annee DESC, r.type_id, r.rang
      `);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des choix:', error);
      throw new Error('Erreur lors de la récupération des choix');
    }
  }

  /**
   * Récupérer tous les types de repêchage
   */
  async getRepechageTypes(): Promise<RepechageType[]> {
    try {
      // `ordre` fixe l'ordre d'affichage du filtre ; un type sans ordre passe à la fin.
      const result = await pool.query('SELECT id, nom FROM types_repechage ORDER BY ordre NULLS LAST, id');
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des types de repêchage:', error);
      throw new Error('Erreur lors de la récupération des types de repêchage');
    }
  }

  /**
   * Récupérer les choix par type et année
   */
  async getChoicesByTypeAndYear(type: number, annee: number): Promise<RepechageChoice[]> {
    try {
      const result = await pool.query(`
        SELECT 
          r.annee,
          r.type_id, 
          r.rang, 
          r.round, 
          e.nom AS nom,
          r.joueur
        FROM 
          repechages r
        JOIN 
          equipes e ON r.equipe_id = e.id
        WHERE 
          r.type_id = $1 AND r.annee = $2
        ORDER BY 
          r.annee DESC, r.type_id, r.rang
      `, [type, annee]);
      return result.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération des choix:', error);
      throw new Error('Erreur lors de la récupération des choix');
    }
  }

  /**
   * Vérifier si un type de repêchage existe
   */
  async typeExists(typeId: number): Promise<boolean> {
    try {
      const result = await pool.query('SELECT id FROM types_repechage WHERE id = $1', [typeId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification du type:', error);
      return false;
    }
  }
}

export const repechageService = new RepechageService();
