import { Request, Response } from 'express';
import { pointsService } from '../services/pointsService';
import { sendSuccess, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class PointsController {
  /**
   * POST /api/points/update
   * Trigger a full points update for all teams (cron endpoint)
   */
  updatePoints = asyncHandler(async (req: Request, res: Response) => {
    const summary = await pointsService.updateAllTeamPoints();
    sendSuccess(res, summary);
  });

  /**
   * GET /api/points/rankings
   * Get rankings for all teams, optionally filtered by season
   */
  getRankings = asyncHandler(async (req: Request, res: Response) => {
    const season = req.query.season as string | undefined;
    const rankings = await pointsService.getRankings(season);
    sendSuccess(res, rankings);
  });

  /**
   * GET /api/points/rankings/:division
   * Get rankings filtered by division (nord/sud)
   */
  getRankingsByDivision = asyncHandler(async (req: Request, res: Response) => {
    const { division } = req.params;

    if (division !== 'nord' && division !== 'sud') {
      sendServerError(res, 'Division invalide. Utilisez "nord" ou "sud".');
      return;
    }

    const season = req.query.season as string | undefined;
    const rankings = await pointsService.getRankingsByDivision(division, season);
    sendSuccess(res, rankings);
  });

  /**
   * GET /api/points/saisons
   * Get distinct seasons available in equipe_points_mensuel
   */
  getSaisonsMensuel = asyncHandler(async (_req: Request, res: Response) => {
    const saisons = await pointsService.getSaisonsMensuel();
    sendSuccess(res, saisons);
  });

  /**
   * GET /api/points/mensuel?season=20222023
   * Get monthly cumulative points per team for a season
   */
  getPointsMensuel = asyncHandler(async (req: Request, res: Response) => {
    const season = req.query.season as string | undefined;
    if (!season) {
      sendServerError(res, 'Paramètre season requis');
      return;
    }
    const data = await pointsService.getPointsMensuel(season);
    sendSuccess(res, data);
  });

  /**
   * GET /api/points/:id
   * Get points for a specific team
   */
  getTeamPoints = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      sendServerError(res, 'ID d\'équipe invalide');
      return;
    }

    const season = req.query.season as string | undefined;
    const points = await pointsService.getTeamPoints(id, season);
    sendSuccess(res, points);
  });
}

export const pointsController = new PointsController();
