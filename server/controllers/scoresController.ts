import { Request, Response } from 'express';
import { scoresService } from '../services/scoresService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class ScoresController {
  /**
   * Get current NHL game scores
   */
  getCurrentScores = asyncHandler(async (req: Request, res: Response) => {
    const scores = await scoresService.getCurrentScores();
    sendSuccess(res, scores);
  });
}

export const scoresController = new ScoresController();
