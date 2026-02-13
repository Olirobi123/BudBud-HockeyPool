import { Router } from 'express';
import { pointsController } from '../controllers/pointsController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// Mettre à jour les points de toutes les équipes (cron)
router.post('/update', requireApiKey, pointsController.updatePoints);

// Classement global
router.get('/rankings', pointsController.getRankings);

// Classement par division (nord/sud)
router.get('/rankings/:division', pointsController.getRankingsByDivision);

// Points d'une équipe spécifique
router.get('/:id', pointsController.getTeamPoints);

export default router;
