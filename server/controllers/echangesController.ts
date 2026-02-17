import { Request, Response } from 'express';
import { echangesService } from '../services/echangesService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class EchangesController {
  /**
   * Récupérer tous les échanges
   */
  getAllEchanges = asyncHandler(async (req: Request, res: Response) => {
    const echanges = await echangesService.getAllEchanges();
    sendSuccess(res, echanges);
  });

  /**
   * Récupérer le dernier échange pour la page d'accueil
   */
  getLatestEchange = asyncHandler(async (req: Request, res: Response) => {
    const trade = await echangesService.getLatestEchange();
    sendSuccess(res, trade);
  });
}

export const echangesController = new EchangesController();
