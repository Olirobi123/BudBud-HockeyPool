import { Router } from 'express';
import { livePointsController } from '../controllers/livePointsController';

const router = Router();

router.get('/', livePointsController.getLivePoints);

export default router;
