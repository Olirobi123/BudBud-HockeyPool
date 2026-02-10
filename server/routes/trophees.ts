import { Router } from 'express';
import { tropheesController } from '../controllers/tropheesController';

const router = Router();

// Récupérer tous les types de trophées
router.get('/', tropheesController.getAllTrophees);

// Récupérer tous les gagnants
router.get('/gagnants', tropheesController.getAllWinners);

// Récupérer les gagnants par année
router.get('/gagnants/:year', tropheesController.getWinnersByYear);

// Récupérer les trophées d'une équipe
router.get('/equipe/:teamId', tropheesController.getTeamTrophies);

export default router;
