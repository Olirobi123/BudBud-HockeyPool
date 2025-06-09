import { Router } from 'express';

const router = Router();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://api-web.nhle.com/v1/player/${id}/landing`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; 38BudBud/1.0)',
            },
        });

        if (!response.ok) {
            console.log(`NHL API error: ${response.status}`);
            throw new Error('Erreur lors de la récupération des données du joueur');
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données du joueur' });
    }
});

export default router;
