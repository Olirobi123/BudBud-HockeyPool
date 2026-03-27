import { Request, Response } from 'express';
import { snapshotService } from '../services/snapshotService';
import { injuriesService } from '../services/injuriesService';
import { etatService } from '../services/etatService';
import { pointsService } from '../services/pointsService';
import { getCurrentSeason } from '../services/seasonHelper';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class SnapshotController {
  /**
   * POST /api/snapshot/live-points
   * Save a nightly snapshot of live points data (cron endpoint)
   */
  saveLivePoints = asyncHandler(async (_req: Request, res: Response) => {
    await snapshotService.saveLivePointsSnapshot();
    sendSuccess(res, { saved: true });
  });

  /**
   * POST /api/snapshot/injuries
   * Save a snapshot of ESPN injury data matched to pool players (cron endpoint)
   */
  saveInjuries = asyncHandler(async (_req: Request, res: Response) => {
    await injuriesService.saveInjuriesSnapshot();
    sendSuccess(res, { saved: true });
  });

  /**
   * POST /api/snapshot/etat
   * Save a nightly snapshot of hot/cold/normal état for all pool players (cron endpoint)
   */
  saveEtat = asyncHandler(async (_req: Request, res: Response) => {
    await etatService.saveEtatSnapshot();
    sendSuccess(res, { saved: true });
  });

  /**
   * POST /api/snapshot/classement-prev
   * Re-snapshot current equipe_points as classement_prev baseline (manual recovery endpoint)
   */
  saveClassementPrev = asyncHandler(async (_req: Request, res: Response) => {
    const season = getCurrentSeason();
    await pointsService.snapshotPreviousClassement(season);
    sendSuccess(res, { saved: true });
  });
}

export const snapshotController = new SnapshotController();
