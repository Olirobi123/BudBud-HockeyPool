import { Request, Response } from 'express';
import { draftDayService } from '../services/draftDayService';
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
}

export const draftDayController = new DraftDayController();
