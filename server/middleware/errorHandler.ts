import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import { sendError, sendServerError } from '../utils/response';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error:', err);

  // Si c'est une ApiError, on l'envoie directement
  if ('status' in err) {
    sendError(res, err);
    return;
  }

  // Sinon, c'est une erreur générique
  sendServerError(res, err.message || 'Une erreur interne est survenue');
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
