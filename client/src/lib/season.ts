/**
 * NHL seasons straddle two calendar years and start in the autumn.
 * September (month index 8) is the cutover: on or after it we are in the
 * season that opens this year, before it we are still in last year's.
 */
const SEASON_START_MONTH = 8;

function startYear(date: Date): number {
  return date.getMonth() >= SEASON_START_MONTH ? date.getFullYear() : date.getFullYear() - 1;
}

/** Human label for the current season, e.g. `2025-26`. */
export function getCurrentSeasonLabel(date: Date = new Date()): string {
  const start = startYear(date);
  const end = (start + 1) % 100;
  return `${start}-${String(end).padStart(2, '0')}`;
}

/** API/database season identifier for the current season, e.g. `20252026`. */
export function getCurrentSeasonId(date: Date = new Date()): string {
  const start = startYear(date);
  return `${start}${start + 1}`;
}

/** ISO date of the season's nominal start — used to filter "this season" records. */
export function getCurrentSeasonStartDate(date: Date = new Date()): string {
  return `${startYear(date)}-09-01`;
}
