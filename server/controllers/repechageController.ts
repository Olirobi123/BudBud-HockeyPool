import { Request, Response } from 'express';
import { repechageService } from '../services/repechageService';
import { sendSuccess, sendNotFound, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class RepechageController {
  /**
   * Récupérer tous les choix au repêchage
   */
  getAllChoices = asyncHandler(async (req: Request, res: Response) => {
    const choices = await repechageService.getAllChoices();
    sendSuccess(res, choices);
  });

  /**
   * Récupérer tous les types de repêchage
   */
  getRepechageTypes = asyncHandler(async (req: Request, res: Response) => {
    const types = await repechageService.getRepechageTypes();
    sendSuccess(res, types);
  });

  /**
   * Récupérer les choix par type et année
   */
  getChoicesByTypeAndYear = asyncHandler(async (req: Request, res: Response) => {
    const type = parseInt(req.params.type);
    const annee = parseInt(req.params.annee);

    if (isNaN(type) || isNaN(annee)) {
      sendServerError(res, 'Type et année doivent être des nombres valides');
      return;
    }

    // Vérifier si le type existe
    const typeExists = await repechageService.typeExists(type);
    if (!typeExists) {
      sendNotFound(res, 'Type de repêchage');
      return;
    }

    const choices = await repechageService.getChoicesByTypeAndYear(type, annee);

    if (choices.length === 0) {
      sendNotFound(res, 'Aucun choix trouvé pour ce type et cette année');
      return;
    }

    sendSuccess(res, choices);
  });
}

export const repechageController = new RepechageController();
