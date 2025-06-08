import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// Récupérer tous les échanges avec les noms des équipes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.date,
                e.details,
                e.equipe_source_id,
                e.equipe_destination_id,
                e.statut_confirmer,
                src.nom as equipe_source_nom,
                dest.nom as equipe_destination_nom
            FROM echanges e
            JOIN equipes src ON e.equipe_source_id = src.id
            JOIN equipes dest ON e.equipe_destination_id = dest.id
            ORDER BY e.date DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des échanges:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des échanges' });
    }
});

// Créer un nouvel échange
router.post('/', async (req, res) => {
    const { equipe_source_id, equipe_destination_id, details } = req.body;
    
    if (!equipe_source_id || !equipe_destination_id || !details) {
        return res.status(400).json({ 
            message: 'Les IDs des équipes et les détails sont requis' 
        });
    }

    try {
        const result = await pool.query(
            'INSERT INTO echanges (date, equipe_source_id, equipe_destination_id, details) VALUES (CURRENT_DATE, $1, $2, $3) RETURNING *',
            [equipe_source_id, equipe_destination_id, details]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la création de l\'échange:', err);
        res.status(500).json({ message: 'Erreur lors de la création de l\'échange' });
    }
});

export default router;
