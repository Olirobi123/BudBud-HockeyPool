import { Router } from 'express';
import { pointsController } from '../controllers/pointsController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// Mettre à jour les points de toutes les équipes (cron)
router.post('/update', requireApiKey, pointsController.updatePoints);

// Saisons disponibles pour le bilan
router.get('/saisons', pointsController.getSaisonsMensuel);

// Points mensuels pour le bilan saison
router.get('/mensuel', pointsController.getPointsMensuel);

// Classement global
router.get('/rankings', pointsController.getRankings);

// Classement par division (nord/sud)
router.get('/rankings/:division', pointsController.getRankingsByDivision);

// Points d'une équipe spécifique
router.get('/:id', pointsController.getTeamPoints);

export default router;
