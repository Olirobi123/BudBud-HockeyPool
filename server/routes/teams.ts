import { Router } from 'express';
import { teamsController } from '../controllers/teamsController';

const router = Router();

// Récupérer toutes les équipes
router.get('/', teamsController.getAllTeams);

// Récupérer uniquement les équipes actives
router.get('/active', teamsController.getActiveTeams);

// Récupérer les équipes inactives
router.get('/inactive', teamsController.getInactiveTeams);

// Récupérer le classement d'une division (nord ou sud)
router.get('/division/:division/standings', teamsController.getDivisionStandings);

// Récupérer une équipe par son ID
router.get('/:id', teamsController.getTeamById);

// Récupérer le roster d'une équipe
router.get('/:id/roster', teamsController.getRoster);

// Récupérer le roster d'une équipe avec stats NHL
router.get('/:id/roster/stats', teamsController.getRosterWithStats);

// Récupérer le dernier échange d'une équipe
router.get('/:id/latest-trade', teamsController.getLatestTrade);

export default router;
