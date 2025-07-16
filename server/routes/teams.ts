import { Router } from 'express';
import { teamsController } from '../controllers/teamsController';

const router = Router();

// Récupérer toutes les équipes
router.get('/', teamsController.getAllTeams);

// Récupérer uniquement les équipes actives
router.get('/active', teamsController.getActiveTeams);

// Récupérer une équipe par son ID
router.get('/:id', teamsController.getTeamById);

export default router;
