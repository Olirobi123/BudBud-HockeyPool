import { Router } from 'express';
import { playersController } from '../controllers/playersController';

const router = Router();

// Récupérer les détails d'un joueur par son ID
router.get('/:id', playersController.getPlayerById);

export default router;
