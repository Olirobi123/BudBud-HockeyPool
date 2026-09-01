/**
 * NHL seasons straddle two calendar years and now open in September
 * (the 2026-27 regular season starts 2026-09-29), so September — month
 * index 8 — is the cutover month across the whole app.
 */
const SEASON_START_MONTH = 8;

function startYear(date: Date): number {
  return date.getMonth() >= SEASON_START_MONTH ? date.getFullYear() : date.getFullYear() - 1;
}

/**
 * Get the current NHL season string (e.g. "20252026").
 */
export function getCurrentSeason(date: Date = new Date()): string {
  const start = startYear(date);
  return `${start}${start + 1}`;
}

/**
 * Get the current NHL season as a number (e.g. 20252026).
 */
export function getCurrentSeasonNumber(date: Date = new Date()): number {
  return parseInt(getCurrentSeason(date), 10);
}

/**
 * ISO date of the season's nominal start — used to filter "this season" records.
 */
export function getCurrentSeasonStartDate(date: Date = new Date()): string {
  return `${startYear(date)}-09-01`;
}
