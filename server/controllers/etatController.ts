import { Request, Response } from 'express';
import { etatService } from '../services/etatService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class EtatController {
  /**
   * GET /api/etat
   * Return all état entries as a Record<nhlPlayerId, EtatInfo>
   */
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const data = await etatService.getEtat();
    sendSuccess(res, data);
  });
}

export const etatController = new EtatController();
