import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { requireApiKey } from '../middleware/apiKeyAuth';

const router = Router();

// Vérifier l'état de santé de l'application
router.get('/', requireApiKey, healthController.check);

export default router;
