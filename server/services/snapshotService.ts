import pool from '../config/database';
import { QUERIES } from '../models';
import { livePointsService } from './livePointsService';

const FULL_KEY = 'live_points';
const LEADERBOARD_KEY = 'live_points_leaderboard';
const FEED_KEY = 'live_points_feed';

export class SnapshotService {
  async saveLivePointsSnapshot(): Promise<void> {
    const response = await livePointsService.getLivePoints();
    const { topPlayers, teamLeaderboard, gamesCount, liveGamesCount } = response;

    await Promise.all([
      pool.query(QUERIES.UPSERT_API_STORE, [
        FULL_KEY,
        JSON.stringify(response),
      ]),
      pool.query(QUERIES.UPSERT_API_STORE, [
        LEADERBOARD_KEY,
        JSON.stringify({ teamLeaderboard, gamesCount, liveGamesCount }),
      ]),
      pool.query(QUERIES.UPSERT_API_STORE, [
        FEED_KEY,
        JSON.stringify({ topPlayers, gamesCount, liveGamesCount }),
      ]),
    ]);
  }
}

export const snapshotService = new SnapshotService();
