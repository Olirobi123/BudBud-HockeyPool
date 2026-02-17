import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../utils/response';

export const validateRequired = (fields: string[]) => (req: Request, res: Response, next: NextFunction): void => {
  const missingFields = fields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    sendValidationError(res, `Champs requis manquants: ${missingFields.join(', ')}`);
    return;
  }

  next();
};
