import pool from '../config/database';
import { QUERIES } from '../models';
import { livePointsService } from './livePointsService';
import { getCurrentSeason } from './seasonHelper';
import { seriesService } from './seriesService';

const FULL_KEY = 'live_points';

export class SnapshotService {
  async saveLivePointsSnapshot(): Promise<void> {
    const season = getCurrentSeason();
    const response = await livePointsService.getLivePoints(false, true);

    await pool.query(QUERIES.UPSERT_API_STORE, [FULL_KEY, response]);

    const ronde = seriesService.getRondeActive();
    if (ronde !== null) {
      await seriesService.updateDailySeries(season, ronde, response.teamLeaderboard);
    }
  }
}

export const snapshotService = new SnapshotService();
