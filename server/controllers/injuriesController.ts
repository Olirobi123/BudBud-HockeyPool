import { Request, Response } from 'express';
import { injuriesService } from '../services/injuriesService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class InjuriesController {
  /**
   * GET /api/injuries
   * Return all injuries as a Record<nhlPlayerId, InjuryInfo>
   */
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await injuriesService.getInjuries();
    sendSuccess(res, data);
  });
}

export const injuriesController = new InjuriesController();
