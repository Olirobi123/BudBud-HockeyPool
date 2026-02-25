import { Router } from 'express';
import { snapshotController } from '../controllers/snapshotController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// Sauvegarder un snapshot des points en direct (cron nocturne)
router.post('/live-points', requireApiKey, snapshotController.saveLivePoints);

// Sauvegarder un snapshot des blessures ESPN (cron nocturne)
router.post('/injuries', requireApiKey, snapshotController.saveInjuries);

export default router;
