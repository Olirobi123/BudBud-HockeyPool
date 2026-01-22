import { Request, Response } from 'express';
import { migrationService } from '../services/migrationService';
import { sendSuccess, sendValidationError, sendServerError } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

interface PopulateRosterBody {
  teamId: number;
  playerNames: string[];
}

export class MigrationController {
  /**
   * Populate team roster from player names
   * POST /api/migration/populate-roster
   */
  populateTeamRoster = asyncHandler(async (req: Request, res: Response) => {
    const { teamId, playerNames } = req.body as PopulateRosterBody;

    // Validate input
    if (!teamId || typeof teamId !== 'number') {
      sendValidationError(res, 'teamId is required and must be a number');
      return;
    }

    if (!playerNames || !Array.isArray(playerNames) || playerNames.length === 0) {
      sendValidationError(res, 'playerNames is required and must be a non-empty array');
      return;
    }

    // Check if team exists
    const teamExists = await migrationService.teamExists(teamId);
    if (!teamExists) {
      sendValidationError(res, `Team with id ${teamId} does not exist`);
      return;
    }

    try {
      const result = await migrationService.populateTeamRoster(teamId, playerNames);
      sendSuccess(res, result);
    } catch (error) {
      sendServerError(
        res,
        error instanceof Error ? error.message : 'Error populating roster',
      );
    }
  });
}

export const migrationController = new MigrationController();
