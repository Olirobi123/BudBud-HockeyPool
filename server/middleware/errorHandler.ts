import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';
import { sendError, sendServerError } from '../utils/response';

// Express only treats a middleware as an error handler when it declares four
// parameters, so `_next` must stay in the signature even though it is unused.
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
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

type RouteHandler = (req: Request, res: Response, next: NextFunction) => unknown;

export const asyncHandler = (fn: RouteHandler) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
