/**
 * Get the current NHL season string (e.g. "20252026").
 * If month >= September, season is currentYear-nextYear.
 * Otherwise, season is previousYear-currentYear.
 */
export function getCurrentSeason(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed: 0=Jan, 8=Sep

  if (month >= 8) {
    return `${year}${year + 1}`;
  }
  return `${year - 1}${year}`;
}

/**
 * Get the current NHL season as a number (e.g. 20252026).
 */
export function getCurrentSeasonNumber(): number {
  return parseInt(getCurrentSeason(), 10);
}
