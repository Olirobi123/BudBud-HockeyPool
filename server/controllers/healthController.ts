import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { checkDatabaseConnection } from '../utils/database';
import { sendSuccess, sendServerError } from '../utils/response';

export class HealthController {
  /**
   * Vérifier l'état de santé de l'application
   */
  check = asyncHandler(async (req: Request, res: Response) => {
    const dbConnected = await checkDatabaseConnection();

    if (dbConnected) {
      sendSuccess(res, {
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } else {
      sendServerError(res, 'Database connection failed');
    }
  });
}

export const healthController = new HealthController();
