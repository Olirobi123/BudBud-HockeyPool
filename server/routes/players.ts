import { Router } from 'express';
import { playersController } from '../controllers/playersController';

const router = Router();

// Rechercher des joueurs via l'API NHL
router.get('/search', playersController.searchPlayers);

// Récupérer l'équipe propriétaire d'un joueur par son NHL ID
router.get('/:nhlId/ownership', playersController.getOwnership);

// Récupérer l'historique complet d'un joueur dans le pool
router.get('/:nhlId/history', playersController.getPlayerHistory);

// Récupérer un joueur de la base locale par son NHL ID
router.get('/nhl/:nhlId', playersController.getPlayerByNhlId);

// Récupérer un joueur de la base locale par son ID interne
router.get('/bd/:id', playersController.getPlayerById);

// Récupérer les détails d'un joueur depuis l'API NHL
router.get('/:id', playersController.getAPIPlayerByNHLId);

export default router;
