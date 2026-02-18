import { Request, Response } from 'express';
import { snapshotService } from '../services/snapshotService';
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
}

export const snapshotController = new SnapshotController();
