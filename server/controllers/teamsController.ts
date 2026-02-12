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

  /**
   * Récupérer le roster d'une équipe
   */
  getRoster = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendServerError(res, 'ID d\'équipe invalide');
      return;
    }

    const roster = await teamsService.getTeamRoster(id);
    sendSuccess(res, roster);
  });

  /**
   * Récupérer le roster d'une équipe avec les stats NHL
   */
  getRosterWithStats = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendServerError(res, 'ID d\'équipe invalide');
      return;
    }

    const roster = await teamsService.getTeamRosterWithStats(id);
    sendSuccess(res, roster);
  });

  /**
   * Récupérer le dernier échange d'une équipe
   */
  getLatestTrade = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendServerError(res, 'ID d\'équipe invalide');
      return;
    }

    const trade = await teamsService.getTeamLatestTrade(id);
    sendSuccess(res, trade);
  });

  /**
   * GET /api/teams/division/:division/standings
   * Returns alphabetically ordered standings for a division
   */
  getDivisionStandings = asyncHandler(async (req: Request, res: Response) => {
    const { division } = req.params;

    if (division !== 'nord' && division !== 'sud') {
      sendServerError(res, 'Division invalide. Utilisez "nord" ou "sud".');
      return;
    }

    const standings = await teamsService.getDivisionStandings(division);
    sendSuccess(res, standings);
  });

  /**
   * GET /api/teams/inactive
   * Returns all inactive teams
   */
  getInactiveTeams = asyncHandler(async (req: Request, res: Response) => {
    const teams = await teamsService.getInactiveTeams();
    sendSuccess(res, teams);
  });
}

export const teamsController = new TeamsController();
