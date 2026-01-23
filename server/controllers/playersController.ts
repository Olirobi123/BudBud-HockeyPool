import { Request, Response } from 'express';
import { playersService } from '../services/playersService';
import { sendSuccess, sendServerError, sendNotFound } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class PlayersController {
  /**
   * Récupérer les détails d'un joueur par son ID NHL (depuis l'API NHL)
   */
  getAPIPlayerByNHLId = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const playerData = await playersService.getAPIPlayerByNHLId(id);
      sendSuccess(res, playerData);
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la récupération des données du joueur');
    }
  });

  /**
   * Rechercher des joueurs via l'API NHL
   */
  searchPlayers = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (typeof q !== 'string' || q.length === 0) {
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

  /**
   * Récupérer l'équipe du pool propriétaire d'un joueur par son NHL ID
   */
  getOwnership = asyncHandler(async (req: Request, res: Response) => {
    const { nhlId } = req.params;
    const nhlIdNum = parseInt(nhlId, 10);

    if (Number.isNaN(nhlIdNum)) {
      sendServerError(res, 'NHL ID invalide');
      return;
    }

    try {
      const team = await playersService.getOwnershipByNhlId(nhlIdNum);
      if (!team) {
        sendSuccess(res, null, 'Joueur non assigné à une équipe');
        return;
      }
      sendSuccess(res, team);
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la récupération de la propriété');
    }
  });

  /**
   * Récupérer un joueur de la base locale par son NHL ID
   */
  getPlayerByNhlId = asyncHandler(async (req: Request, res: Response) => {
    const { nhlId } = req.params;
    const nhlIdNum = parseInt(nhlId, 10);

    if (Number.isNaN(nhlIdNum)) {
      sendServerError(res, 'NHL ID invalide');
      return;
    }

    try {
      const joueur = await playersService.getPlayerByNhlId(nhlIdNum);
      if (!joueur) {
        sendNotFound(res, 'Joueur');
        return;
      }
      sendSuccess(res, joueur);
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la récupération du joueur');
    }
  });

  /**
   * Récupérer un joueur de la base locale par son ID interne
   */
  getPlayerById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const idNum = parseInt(id, 10);

    if (Number.isNaN(idNum)) {
      sendServerError(res, 'ID invalide');
      return;
    }

    try {
      const playerData = await playersService.getPlayerById(idNum);
      sendSuccess(res, playerData);
    } catch (error) {
      sendServerError(res, error instanceof Error ? error.message : 'Erreur lors de la récupération des données du joueur');
    }
  });
}

export const playersController = new PlayersController();
