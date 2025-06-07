import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// Récupérer toutes les équipes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM equipes'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des équipes:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des équipes' });
    }
});

export default router;
