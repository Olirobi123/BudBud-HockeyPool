import { Request, Response } from 'express';
import { draftDayService } from '../services/draftDayService';
import { draftRegieService } from '../services/draftRegieService';
import { sendSuccess, sendValidationError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class DraftDayController {
  getFlag = asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await draftDayService.getFlag());
  });

  getBoard = asyncHandler(async (_req: Request, res: Response) => {
    const { annee } = await draftDayService.getFlag();
    sendSuccess(res, await draftDayService.getBoard(annee));
  });

  getListes = asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await draftDayService.getListes());
  });

  getListeJoueurs = asyncHandler(async (req: Request, res: Response) => {
    const listeId = parseInt(req.params.id, 10);
    if (isNaN(listeId)) {
      sendValidationError(res, "L'identifiant de la liste doit être un nombre");
      return;
    }
    const { annee } = await draftDayService.getFlag();
    sendSuccess(res, await draftDayService.getListeJoueurs(listeId, annee));
  });

  // --- Régie du draft en direct (page /regie-repechage) ---

  searchProspects = asyncHandler(async (req: Request, res: Response) => {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    sendSuccess(res, await draftRegieService.searchProspects(q));
  });

  setPickEquipe = asyncHandler(async (req: Request, res: Response) => {
    const rang = parseInt(req.params.rang, 10);
    const equipeId = Number((req.body as { equipeId?: unknown }).equipeId);
    if (isNaN(rang) || !Number.isInteger(equipeId)) {
      sendValidationError(res, 'Rang et equipeId doivent être des nombres');
      return;
    }
    const { annee } = await draftDayService.getFlag();
    await draftRegieService.setPickEquipe(annee, rang, equipeId);
    sendSuccess(res, null);
  });

  setPickJoueur = asyncHandler(async (req: Request, res: Response) => {
    const rang = parseInt(req.params.rang, 10);
    const nhlPlayerId = Number((req.body as { nhlPlayerId?: unknown }).nhlPlayerId);
    if (isNaN(rang) || !Number.isInteger(nhlPlayerId)) {
      sendValidationError(res, 'Rang et nhlPlayerId doivent être des nombres');
      return;
    }
    const { annee } = await draftDayService.getFlag();
    await draftRegieService.setPickJoueur(annee, rang, nhlPlayerId);
    sendSuccess(res, null);
  });

  clearPickJoueur = asyncHandler(async (req: Request, res: Response) => {
    const rang = parseInt(req.params.rang, 10);
    if (isNaN(rang)) {
      sendValidationError(res, 'Le rang doit être un nombre');
      return;
    }
    const { annee } = await draftDayService.getFlag();
    await draftRegieService.clearPickJoueur(annee, rang);
    sendSuccess(res, null);
  });
}

export const draftDayController = new DraftDayController();
