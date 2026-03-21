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

    // Load prev classement snapshot + current equipe_points for diff-based totalPoints
    const [prevResult, currResult] = await Promise.all([
      pool.query(QUERIES.GET_API_STORE, ['classement_prev']),
      pool.query(QUERIES.GET_CURRENT_EQUIPE_POINTS_ALL, [season]),
    ]);

    const prevTeams: Record<string, number> = prevResult.rows[0]?.json_response?.teams ?? {};
    const currMap = new Map<number, number>(
      (currResult.rows as { equipe_id: number; total_points: number }[]).map((r) => [r.equipe_id, r.total_points]),
    );

    const patchedLeaderboard = response.teamLeaderboard.map((team) => ({
      ...team,
      totalPoints: Math.max(0, (currMap.get(team.equipeId) ?? 0) - (prevTeams[String(team.equipeId)] ?? 0)),
    }));

    const patched = { ...response, teamLeaderboard: patchedLeaderboard };

    await pool.query(QUERIES.UPSERT_API_STORE, [FULL_KEY, patched]);

    const ronde = seriesService.getRondeActive();
    if (ronde !== null) {
      await seriesService.updateDailySeries(season, ronde, patched.teamLeaderboard);
    }
  }
}

export const snapshotService = new SnapshotService();
