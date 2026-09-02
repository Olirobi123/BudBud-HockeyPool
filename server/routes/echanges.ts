import { Router } from 'express';
import { echangesController } from '../controllers/echangesController';

const router = Router();

// Récupérer tous les échanges avec les noms des équipes
router.get('/', echangesController.getAllEchanges);

// Récupérer les derniers échanges (pour la page d'accueil)
router.get('/recent', echangesController.getRecentEchanges);

export default router;
