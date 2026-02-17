import { Request, Response } from 'express';

export class HealthController {
  /**
   * Liveness check
   * Ne touche PAS à la base de données
   */
  check = (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(), // seconds
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed,
      },
    });
  };
}

export const healthController = new HealthController();
