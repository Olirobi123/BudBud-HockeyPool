import { NHLClient, GameScore } from '@olirobi/nhl_api_client';

export class ScoresService {
  private nhlClient: NHLClient;

  constructor() {
    this.nhlClient = new NHLClient();
  }

  /**
   * Get current NHL game scores
   */
  async getCurrentScores(): Promise<GameScore[]> {
    try {
      const response = await this.nhlClient.games.scores();
      return response.games || [];
    } catch (error) {
      console.error('Error fetching NHL scores:', error);
      throw new Error('Failed to fetch NHL scores');
    }
  }
}

export const scoresService = new ScoresService();
