import { Router } from 'express';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ message: 'Invalid player ID' });
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, 5000); // Timeout after 5 seconds

    const response = await fetch(`https://api-web.nhle.com/v1/player/${id}/landing`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; 38BudBud/1.0)',
      },
      signal: abortController.signal,
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
