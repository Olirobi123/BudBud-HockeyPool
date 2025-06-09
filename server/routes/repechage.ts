import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// Récupérer tous les choix au repêchage
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * from repechages ORDER BY annee DESC, type_id, rang;
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des choix:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des choix' });
    }
});

router.get('/:type/:annee', async (req, res) => {
    const { type, annee } = req.params;
    try {
        const result = await pool.query(`
            SELECT * from repechages WHERE type_id = ? AND annee = ? ORDER BY annee DESC, type_id, rang;
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
