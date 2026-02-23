import { Request, Response } from 'express';
import { misAuBallotageService } from '../services/misAuBallotageService';
import { sendSuccess, sendNotFound, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class MisAuBallotageController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await misAuBallotageService.getAll();
    sendSuccess(res, data);
  });

  getByTypeAndYear = asyncHandler(async (req: Request, res: Response) => {
    const type = parseInt(req.params.type);
    const annee = parseInt(req.params.annee);

    if (isNaN(type) || isNaN(annee)) {
      sendServerError(res, 'Type et année doivent être des nombres valides');
      return;
    }

    const typeExists = await misAuBallotageService.typeExists(type);
    if (!typeExists) {
      sendNotFound(res, 'Type de repêchage');
      return;
    }

    const data = await misAuBallotageService.getByTypeAndYear(type, annee);

    if (data.length === 0) {
      sendNotFound(res, 'Aucune mise au ballotage trouvée pour ce type et cette année');
      return;
    }

    sendSuccess(res, data);
  });
}

export const misAuBallotageController = new MisAuBallotageController();
