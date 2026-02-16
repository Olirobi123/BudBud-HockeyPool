import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { livePointsService } from '../services/livePointsService';

export class LivePointsController {
  getLivePoints = asyncHandler(async (req: Request, res: Response) => {
    const livePoints = await livePointsService.getLivePoints();
    sendSuccess(res, livePoints);
  });
}

export const livePointsController = new LivePointsController();
