import { Router } from 'express';
import { echangesController } from '../controllers/echangesController';
import { validateCreateEchange } from '../middleware/validation';

const router = Router();

// Récupérer tous les échanges avec les noms des équipes
router.get('/', echangesController.getAllEchanges);

// Créer un nouvel échange
router.post('/', validateCreateEchange, echangesController.createEchange);

// Récupérer le dernier échange (pour la page d'accueil)
router.get('/latest', echangesController.getLatestEchange);

// Récupérer l'activité récente (pour le feed d'accueil)
router.get('/activity', echangesController.getRecentActivity);

// Récupérer un échange par son ID
router.get('/:id', echangesController.getEchangeById);

export default router;
