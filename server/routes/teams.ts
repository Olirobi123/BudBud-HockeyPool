import { Router } from 'express';
import { teamsController } from '../controllers/teamsController';

const router = Router();

// Récupérer toutes les équipes
router.get('/', teamsController.getAllTeams);

// Récupérer uniquement les équipes actives
router.get('/active', teamsController.getActiveTeams);

// Récupérer une équipe par son ID
router.get('/:id', teamsController.getTeamById);

// Récupérer le roster d'une équipe
router.get('/:id/roster', teamsController.getRoster);

// Récupérer le dernier échange d'une équipe
router.get('/:id/latest-trade', teamsController.getLatestTrade);

export default router;
