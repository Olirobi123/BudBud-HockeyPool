import { NHLClient } from '@olirobi/nhl_api_client';
import pool from '../config/database';

interface PlayerResult {
  name: string;
  nhlPlayerId: number;
  position: string;
}

interface PlayerError {
  name: string;
  error: string;
}

interface PopulateRosterResult {
  success: boolean;
  teamId: number;
  playersAdded: PlayerResult[];
  errors: PlayerError[];
}

export class MigrationService {
  private nhlClient: NHLClient;

  constructor() {
    this.nhlClient = new NHLClient();
  }

  /**
   * Populate team roster by searching NHL API for player names
   * and inserting them into the joueurs table
   */
  async populateTeamRoster(teamId: number, playerNames: string[]): Promise<PopulateRosterResult> {
    const playersAdded: PlayerResult[] = [];
    const errors: PlayerError[] = [];
    const nhlPlayerIds: number[] = [];

    // Process each player name
    for (const playerName of playerNames) {
      try {
        // Search for player in NHL API - returns array directly
        const searchResults = await this.nhlClient.players.search(playerName.trim()) as unknown as Array<{
          playerId: string;
          name: string;
          positionCode?: string;
        }>;

        if (!searchResults || searchResults.length === 0) {
          errors.push({ name: playerName, error: 'Player not found in NHL API' });
          continue;
        }

        // Take the first result
        const player = searchResults[0];
        const nhlPlayerId = parseInt(player.playerId, 10);
        const position = player.positionCode ?? 'C'; // Default to C if not available

        // Parse name into first and last name
        const nameParts = player.name.split(' ');
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join(' ');

        // Insert/Update player in joueurs table
        await pool.query(
          `INSERT INTO joueurs (nhl_player_id, nom, prenom, position)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (nhl_player_id) DO UPDATE SET
             nom = EXCLUDED.nom,
             prenom = EXCLUDED.prenom,
             position = EXCLUDED.position
           RETURNING id, nhl_player_id`,
          [nhlPlayerId, nom, prenom, position]
        );

        nhlPlayerIds.push(nhlPlayerId);
        playersAdded.push({
          name: player.name,
          nhlPlayerId,
          position,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ name: playerName, error: errorMessage });
      }
    }

    // Update team roster with collected NHL player IDs
    if (nhlPlayerIds.length > 0) {
      await pool.query(
        `UPDATE equipes SET nhl_player_ids = $1 WHERE id = $2`,
        [nhlPlayerIds, teamId]
      );
    }

    return {
      success: errors.length === 0,
      teamId,
      playersAdded,
      errors,
    };
  }

  /**
   * Check if a team exists
   */
  async teamExists(teamId: number): Promise<boolean> {
    const result = await pool.query('SELECT id FROM equipes WHERE id = $1', [teamId]);
    return result.rows.length > 0;
  }
}

export const migrationService = new MigrationService();
