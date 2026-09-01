import { describe, expect, it } from 'vitest';
import {
  getCurrentSeason,
  getCurrentSeasonNumber,
  getCurrentSeasonStartDate,
} from '../seasonHelper';

/**
 * The NHL season now opens in September (2026-27 drops the puck 2026-09-29),
 * so September is the cutover month everywhere in the app.
 */
describe('seasonHelper', () => {
  it('treats 1 September as the first day of the new season', () => {
    expect(getCurrentSeason(new Date('2026-09-01T12:00:00Z'))).toBe('20262027');
  });

  it('still reports the previous season on 31 August', () => {
    expect(getCurrentSeason(new Date('2026-08-31T12:00:00Z'))).toBe('20252026');
  });

  it('keeps the new season through the winter months', () => {
    expect(getCurrentSeason(new Date('2027-01-15T12:00:00Z'))).toBe('20262027');
  });

  it('exposes the season as a number', () => {
    expect(getCurrentSeasonNumber(new Date('2026-09-01T12:00:00Z'))).toBe(20262027);
  });

  it('anchors the season start to 1 September, not 1 October', () => {
    expect(getCurrentSeasonStartDate(new Date('2026-09-29T12:00:00Z'))).toBe('2026-09-01');
  });
});
