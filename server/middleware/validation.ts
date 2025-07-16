import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../utils/response';

export const validateCreateEchange = (req: Request, res: Response, next: NextFunction): void => {
  const { equipe_source_id, equipe_destination_id, details } = req.body;

  if (!equipe_source_id) {
    sendValidationError(res, 'L\'équipe source est requise');
    return;
  }

  if (!equipe_destination_id) {
    sendValidationError(res, 'L\'équipe destination est requise');
    return;
  }

  if (equipe_source_id === equipe_destination_id) {
    sendValidationError(res, 'Les équipes source et destination doivent être différentes');
    return;
  }

  if (!details || details.length < 10) {
    sendValidationError(res, 'Les détails doivent contenir au moins 10 caractères');
    return;
  }

  next();
};

export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      sendValidationError(res, `Champs requis manquants: ${missingFields.join(', ')}`);
      return;
    }

    next();
  };
}; 