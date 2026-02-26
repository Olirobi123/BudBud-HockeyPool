import { NHLClient, GameScore } from '@olirobi/nhl_api_client';

export interface ScoresResult {
  games: GameScore[];
  currentDate: string;
}

export class ScoresService {
  private nhlClient: NHLClient;

  constructor() {
    this.nhlClient = new NHLClient();
  }

  /**
   * Get current NHL game scores along with the NHL's current date (Eastern time)
   */
  async getCurrentScores(): Promise<ScoresResult> {
    try {
      const response = await this.nhlClient.games.scores();
      return {
        games: response.games || [],
        currentDate: response.currentDate ?? new Date().toISOString().slice(0, 10),
      };
    } catch (error) {
      console.error('Error fetching NHL scores:', error);
      throw new Error('Failed to fetch NHL scores');
    }
  }
}

export const scoresService = new ScoresService();
