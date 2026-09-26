import { Router } from 'express';
import { draftDayController } from '../controllers/draftDayController';

const router = Router();

router.get('/', draftDayController.getFlag);
router.get('/board', draftDayController.getBoard);
router.get('/listes', draftDayController.getListes);
router.get('/listes/:id', draftDayController.getListeJoueurs);

// Régie du draft en direct — volontairement sans lien dans le site, pas d'authentification.
router.get('/regie/recherche', draftDayController.searchProspects);
router.post('/picks', draftDayController.addDynamicPick);
router.delete('/picks/:rang', draftDayController.removeDynamicPick);
router.put('/picks/:rang/equipe', draftDayController.setPickEquipe);
router.put('/picks/:rang/joueur', draftDayController.setPickJoueur);
router.delete('/picks/:rang/joueur', draftDayController.clearPickJoueur);

export default router;
