import { Request, Response } from 'express';
import { echangesService } from '../services/echangesService';
import { sendSuccess, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';
import { CreateEchangeRequest } from '../types';

export class EchangesController {
  /**
   * Récupérer tous les échanges
   */
  getAllEchanges = asyncHandler(async (req: Request, res: Response) => {
    const echanges = await echangesService.getAllEchanges();
    sendSuccess(res, echanges);
  });

  /**
   * Créer un nouvel échange
   */
  createEchange = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateEchangeRequest = req.body;
    
    try {
      const echange = await echangesService.createEchange(data);
      sendSuccess(res, echange, 'Échange créé avec succès');
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la création de l\'échange');
    }
  });

  /**
   * Récupérer un échange par son ID
   */
  getEchangeById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      sendServerError(res, 'ID d\'échange invalide');
      return;
    }

    const echange = await echangesService.getEchangeById(id);
    
    if (!echange) {
      sendServerError(res, 'Échange non trouvé');
      return;
    }

    sendSuccess(res, echange);
  });
}

export const echangesController = new EchangesController(); 