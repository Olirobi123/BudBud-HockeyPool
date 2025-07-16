import { Request, Response } from 'express';
import { playersService } from '../services/playersService';
import { sendSuccess, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class PlayersController {
  /**
   * Récupérer les détails d'un joueur par son ID
   */
  getPlayerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const playerData = await playersService.getPlayerById(id);
      sendSuccess(res, playerData);
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la récupération des données du joueur');
    }
  });

  /**
   * Rechercher des joueurs
   */
  searchPlayers = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      sendServerError(res, 'Paramètre de recherche requis');
      return;
    }

    try {
      const players = await playersService.searchPlayers(q);
      sendSuccess(res, players);
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la recherche de joueurs');
    }
  });
}

export const playersController = new PlayersController(); 