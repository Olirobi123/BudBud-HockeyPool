import type { GameScore } from '@olirobi/nhl_api_client';
import type { LivePointsResponse } from '../types';

const ACTIVE_GAME_STATES = new Set(['LIVE', 'CRIT', 'FINAL', 'OFF']);
const COMPLETED_GAME_STATES = new Set(['FINAL', 'OFF']);
const LIVE_GAME_STATES = new Set(['LIVE', 'CRIT']);
const CRON_BOUNDARY_MINUTES = 3 * 60; // 03:00 ET

/** Returns ET date string (YYYY-MM-DD) for the given Date. */
function toEtDateString(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
}

/** Returns total minutes since midnight in ET for the given Date. */
function toEtMinutes(d: Date): number {
  const et = new Date(d.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return et.getHours() * 60 + et.getMinutes();
}

/** Returns true when the snapshot should be served instead of play-by-play. */
export function shouldServeSnapshot(
  snapshot: { data: LivePointsResponse; updatedAt: Date },
  games: GameScore[],
  now: Date = new Date(),
): boolean {
  const nowMinutes = toEtMinutes(now);
  const todayDate = toEtDateString(now);
  const yesterdayDate = toEtDateString(new Date(now.getTime() - 24 * 60 * 60 * 1000));

  const snapshotDate = toEtDateString(snapshot.updatedAt);
  const snapshotMinutes = toEtMinutes(snapshot.updatedAt);

  if (!isSnapshotFresh(nowMinutes, snapshotDate, snapshotMinutes, todayDate, yesterdayDate)) {
    return false;
  }

  const prevDateGames = games.filter((g) => g.gameDate !== todayDate);

  if (hasTodayGames(games, todayDate)) return false;
  if (hasPrevDayInProgress(prevDateGames)) return false;
  if (nowMinutes < CRON_BOUNDARY_MINUTES && hasPrevDayCompleted(prevDateGames)) return false;

  return true;
}

/** Checks if the snapshot was written after the most recent 03:00 ET cron boundary. */
function isSnapshotFresh(
  nowMinutes: number,
  snapshotDate: string,
  snapshotMinutes: number,
  todayDate: string,
  yesterdayDate: string,
): boolean {
  if (nowMinutes >= CRON_BOUNDARY_MINUTES) {
    return snapshotDate === todayDate && snapshotMinutes >= CRON_BOUNDARY_MINUTES;
  }
  return (snapshotDate === yesterdayDate && snapshotMinutes >= CRON_BOUNDARY_MINUTES) ||
    snapshotDate === todayDate;
}

/** Checks for today-ET games in an active state. */
function hasTodayGames(games: GameScore[], todayDate: string): boolean {
  return games.filter((g) => g.gameDate === todayDate).some((g) => ACTIVE_GAME_STATES.has(g.gameState));
}

/** Checks for prev-day games still in progress (overtime past midnight). */
function hasPrevDayInProgress(prevDateGames: GameScore[]): boolean {
  return prevDateGames.some((g) => LIVE_GAME_STATES.has(g.gameState));
}

/** Checks for prev-day completed games before the 03:00 ET cron boundary. */
function hasPrevDayCompleted(prevDateGames: GameScore[]): boolean {
  return prevDateGames.some((g) => COMPLETED_GAME_STATES.has(g.gameState));
}
