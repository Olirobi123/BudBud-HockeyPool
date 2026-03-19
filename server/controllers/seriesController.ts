import { Request, Response } from 'express';
import { seriesService } from '../services/seriesService';
import { sendSuccess, sendServerError, sendValidationError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { getCurrentSeason } from '../services/seasonHelper';

export class SeriesController {
  /**
   * GET /api/series
   * Full bracket data for the current season
   */
  getSeries = asyncHandler(async (req: Request, res: Response) => {
    const saison = (req.query.saison as string | undefined) ?? getCurrentSeason();
    const data = await seriesService.getSeriesData(saison);
    sendSuccess(res, data);
  });

  /**
   * POST /api/series/initialize
   * Seed the QF bracket from current standings (admin, API key required)
   */
  initializeBracket = asyncHandler(async (req: Request, res: Response) => {
    const saison = (req.body?.saison as string | undefined) ?? getCurrentSeason();
    await seriesService.initializeBracket(saison);
    sendSuccess(res, { message: 'Bracket initialisé', saison });
  });

  /**
   * POST /api/series/snapshot-baseline
   * Snapshot current equipe_points as weekly baseline (admin, API key required)
   */
  snapshotBaseline = asyncHandler(async (req: Request, res: Response) => {
    const saison = (req.body?.saison as string | undefined) ?? getCurrentSeason();
    const semaine = parseInt(req.body?.semaine ?? '');

    if (isNaN(semaine) || semaine < 1 || semaine > 3) {
      sendValidationError(res, 'semaine doit être 1, 2 ou 3');
      return;
    }

    await seriesService.snapshotWeekBaseline(saison, semaine);
    sendSuccess(res, { message: 'Baseline enregistrée', saison, semaine });
  });

  /**
   * POST /api/series/update-week
   * Compute and persist weekly points diff (cron, API key required)
   */
  updateWeek = asyncHandler(async (req: Request, res: Response) => {
    const saison = (req.body?.saison as string | undefined) ?? getCurrentSeason();
    const semaine = parseInt(req.body?.semaine ?? '');

    if (isNaN(semaine) || semaine < 1 || semaine > 3) {
      sendValidationError(res, 'semaine doit être 1, 2 ou 3');
      return;
    }

    await seriesService.updateWeeklyPoints(saison, semaine);
    sendSuccess(res, { message: 'Points hebdomadaires mis à jour', saison, semaine });
  });

  /**
   * POST /api/series/resolve-round
   * Determine round winners and seed next round (admin, API key required)
   */
  resolveRound = asyncHandler(async (req: Request, res: Response) => {
    const saison = (req.body?.saison as string | undefined) ?? getCurrentSeason();
    const ronde = parseInt(req.body?.ronde ?? '');

    if (ronde !== 1 && ronde !== 2 && ronde !== 3) {
      sendValidationError(res, 'ronde doit être 1, 2 ou 3');
      return;
    }

    await seriesService.resolveRound(saison, ronde as 1 | 2 | 3);
    sendSuccess(res, { message: 'Ronde résolue', saison, ronde });
  });

  /**
   * POST /api/series/auto-update
   * Run snapshot-baseline (if first call of week) + update weekly points.
   * Designed for nightly cron job: detects the active semaine automatically.
   */
  autoUpdate = asyncHandler(async (req: Request, res: Response) => {
    const saison = (req.body?.saison as string | undefined) ?? getCurrentSeason();

    // Determine active semaine from request or auto-detect
    const rawSemaine = req.body?.semaine;
    if (rawSemaine === undefined || rawSemaine === null) {
      sendValidationError(res, 'semaine requis');
      return;
    }
    const semaine = parseInt(rawSemaine);
    if (isNaN(semaine) || semaine < 1 || semaine > 3) {
      sendValidationError(res, 'semaine doit être 1, 2 ou 3');
      return;
    }

    await seriesService.updateWeeklyPoints(saison, semaine);
    sendSuccess(res, { message: 'Auto-update terminé', saison, semaine });
  });
}

export const seriesController = new SeriesController();
