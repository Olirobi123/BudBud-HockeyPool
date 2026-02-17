import { Router } from 'express';
import { echangesController } from '../controllers/echangesController';

const router = Router();

// Récupérer tous les échanges avec les noms des équipes
router.get('/', echangesController.getAllEchanges);

// Récupérer le dernier échange (pour la page d'accueil)
router.get('/latest', echangesController.getLatestEchange);

export default router;
