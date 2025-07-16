import { Router } from 'express';
import { repechageController } from '../controllers/repechageController';

const router = Router();

// Récupérer tous les choix au repêchage
router.get('/', repechageController.getAllChoices);

// Récupérer tous les types de repêchage
router.get('/types', repechageController.getRepechageTypes);

// Récupérer les choix par type et année
router.get('/:type/:annee', repechageController.getChoicesByTypeAndYear);

export default router;
