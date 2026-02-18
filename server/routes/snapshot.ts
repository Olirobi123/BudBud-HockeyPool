import { Router } from 'express';
import { snapshotController } from '../controllers/snapshotController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// Sauvegarder un snapshot des points en direct (cron nocturne)
router.post('/live-points', requireApiKey, snapshotController.saveLivePoints);

export default router;
