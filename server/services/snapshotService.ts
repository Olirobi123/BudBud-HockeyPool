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

    if (response.gamesCount === 0) return;

    await pool.query(QUERIES.UPSERT_API_STORE, [FULL_KEY, response]);

    // Use yesterday's UTC date — the same game day livePointsService captures — so games
    // played on the last day of a round (e.g. March 29) are credited to that round even
    // though the cron runs after midnight UTC the following day (March 30).
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    const gameDate = d.toISOString().slice(0, 10);
    const ronde = seriesService.getRondeForDate(gameDate);
    if (ronde !== null) {
      await seriesService.updateDailySeries(season, ronde, response.teamLeaderboard);
    }
  }

  /** Same as saveLivePointsSnapshot but skips the playoffs series update (safe for manual recovery). */
  async saveLivePointsSnapshotOnly(): Promise<void> {
    const response = await livePointsService.getLivePoints(false, true);
    if (response.gamesCount === 0) return;
    await pool.query(QUERIES.UPSERT_API_STORE, [FULL_KEY, response]);
  }
}

export const snapshotService = new SnapshotService();
