import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// Récupérer tous les choix au repêchage
router.get('/', async (req, res) => {
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
                r.annee DESC, r.type_id, r.rang;

        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des choix:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des choix' });
    }
});

router.get('/types', async (_req, res) => {
  try {
    const result = await pool.query('SELECT id, nom FROM types_repechage ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des types de repêchage' });
  }
});

router.get('/:type/:annee', async (req, res) => {
    const { type, annee } = req.params;
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
            r.type_id = ? AND r.annee = ?
        ORDER BY 
            r.annee DESC, r.type_id, r.rang;
        `, [type, annee]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aucun choix trouvé pour ce type et cette année' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des choix:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des choix' });
    }
});

export default router;
