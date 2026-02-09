import { Request, Response, NextFunction } from 'express';

export const requireApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['x-api-key'] || req.headers.authorization?.replace('Bearer ', '');

  if (token !== process.env.CRON_API_TOKEN) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  next();
};
