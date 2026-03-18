import { Router } from 'express';
import { etatController } from '../controllers/etatController';

const router = Router();

// Obtenir l'état (hot/cold/normal) de tous les joueurs du pool
router.get('/', etatController.getAll);

export default router;
