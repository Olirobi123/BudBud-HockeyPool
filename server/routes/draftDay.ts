import { Router } from 'express';
import { draftDayController } from '../controllers/draftDayController';

const router = Router();

router.get('/', draftDayController.getFlag);
router.get('/board', draftDayController.getBoard);
router.get('/listes', draftDayController.getListes);
router.get('/listes/:id', draftDayController.getListeJoueurs);

export default router;
