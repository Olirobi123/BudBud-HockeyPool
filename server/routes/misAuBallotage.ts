import { Router } from 'express';
import { misAuBallotageController } from '../controllers/misAuBallotageController';

const router = Router();

router.get('/', misAuBallotageController.getAll);
router.get('/:type/:annee', misAuBallotageController.getByTypeAndYear);

export default router;
