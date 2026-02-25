import { Router } from 'express';
import { injuriesController } from '../controllers/injuriesController';

const router = Router();

// Obtenir toutes les blessures des joueurs du pool
router.get('/', injuriesController.getAll);

export default router;
