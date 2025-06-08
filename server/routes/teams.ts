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

// Récupérer uniquement les équipes actives
router.get('/active', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM equipes WHERE active = true'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des équipes actives:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des équipes actives' });
    }
});

// Récupérer une équipe par son ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM equipes WHERE id = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Équipe non trouvée' });
        }
        
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'équipe:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'équipe' });
    }
});


export default router;
