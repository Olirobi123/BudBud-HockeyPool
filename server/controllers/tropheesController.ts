import { Request, Response } from 'express';
import { tropheesService } from '../services/tropheesService';
import { sendSuccess, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class TropheesController {
  /**
   * Récupérer tous les types de trophées
   */
  getAllTrophees = asyncHandler(async (_req: Request, res: Response) => {
    const trophees = await tropheesService.getAllTrophees();
    sendSuccess(res, trophees);
  });

  /**
   * Récupérer tous les gagnants
   */
  getAllWinners = asyncHandler(async (_req: Request, res: Response) => {
    const winners = await tropheesService.getAllWinners();
    sendSuccess(res, winners);
  });

  /**
   * Récupérer les gagnants par année
   */
  getWinnersByYear = asyncHandler(async (req: Request, res: Response) => {
    const year = parseInt(req.params.year);

    if (isNaN(year)) {
      sendServerError(res, 'Année invalide');
      return;
    }

    const winners = await tropheesService.getWinnersByYear(year);
    sendSuccess(res, winners);
  });

  /**
   * Récupérer les trophées d'une équipe
   */
  getTeamTrophies = asyncHandler(async (req: Request, res: Response) => {
    const teamId = parseInt(req.params.teamId);

    if (isNaN(teamId)) {
      sendServerError(res, 'ID d\'équipe invalide');
      return;
    }

    const trophies = await tropheesService.getTeamTrophies(teamId);
    sendSuccess(res, trophies);
  });
}

export const tropheesController = new TropheesController();
