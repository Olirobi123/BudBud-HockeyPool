import { Router } from 'express';
import { seriesController } from '../controllers/seriesController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// Données complètes du bracket (public)
router.get('/', seriesController.getSeries);

// Initialiser le bracket QF (admin)
router.post('/initialize', requireApiKey, seriesController.initializeBracket);

// Snapshot baseline de semaine (admin)
router.post('/snapshot-baseline', requireApiKey, seriesController.snapshotBaseline);

// Mettre à jour les points hebdomadaires (cron)
router.post('/update-week', requireApiKey, seriesController.updateWeek);

// Résoudre une ronde et seeder la suivante (admin)
router.post('/resolve-round', requireApiKey, seriesController.resolveRound);

// Auto-update (cron nightly)
router.post('/auto-update', requireApiKey, seriesController.autoUpdate);

export default router;
