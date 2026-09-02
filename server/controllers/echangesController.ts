import { Request, Response } from 'express';
import { echangesService } from '../services/echangesService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

const MAX_RECENT_ECHANGES = 5;

export class EchangesController {
  /**
   * Récupérer tous les échanges
   */
  getAllEchanges = asyncHandler(async (req: Request, res: Response) => {
    const echanges = await echangesService.getAllEchanges();
    sendSuccess(res, echanges);
  });

  /**
   * Récupérer les derniers échanges pour la page d'accueil.
   *
   * `limit` est borné entre 1 et MAX_RECENT_ECHANGES : la valeur vient du
   * client, qui demande de quoi remplir sa colonne sans plus.
   */
  getRecentEchanges = asyncHandler(async (req: Request, res: Response) => {
    const requested = Number.parseInt(String(req.query.limit ?? ''), 10);
    const limit = Number.isNaN(requested)
      ? 1
      : Math.min(Math.max(requested, 1), MAX_RECENT_ECHANGES);

    const trades = await echangesService.getRecentEchanges(limit);
    sendSuccess(res, trades);
  });
}

export const echangesController = new EchangesController();
