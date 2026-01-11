import { Request, Response } from 'express';
import { teamsService } from '../services/teamsService';
import { sendSuccess, sendNotFound, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class TeamsController {
  /**
   * Récupérer toutes les équipes
   */
  getAllTeams = asyncHandler(async (req: Request, res: Response) => {
    const teams = await teamsService.getAllTeams();
    sendSuccess(res, teams);
  });

  /**
   * Récupérer uniquement les équipes actives
   */
  getActiveTeams = asyncHandler(async (req: Request, res: Response) => {
    const teams = await teamsService.getActiveTeams();
    sendSuccess(res, teams);
  });

  /**
   * Récupérer une équipe par son ID
   */
  getTeamById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendServerError(res, 'ID d\'équipe invalide');
      return;
    }

    const team = await teamsService.getTeamById(id);

    if (!team) {
      sendNotFound(res, 'Équipe');
      return;
    }

    sendSuccess(res, team);
  });
}

export const teamsController = new TeamsController();
