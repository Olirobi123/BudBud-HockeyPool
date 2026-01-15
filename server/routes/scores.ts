import { Router } from 'express';
import { scoresController } from '../controllers/scoresController';

const router = Router();

// Get current NHL game scores
router.get('/', scoresController.getCurrentScores);

export default router;
