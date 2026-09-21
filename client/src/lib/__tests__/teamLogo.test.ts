// vitest est une dépendance du workspace racine, partagée avec les tests du serveur.
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, expect } from 'vitest';
import { isSamsungForcedDark, toDarkTeamLogo } from '../teamLogo';

const SAMSUNG_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S921W) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0.0.0 Mobile Safari/537.36';
const CHROME_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S921W) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36';

describe('toDarkTeamLogo', () => {
  it('swaps the light variant for the dark one', () => {
    expect(toDarkTeamLogo('https://assets.nhle.com/logos/nhl/svg/MTL_light.svg'))
      .toBe('https://assets.nhle.com/logos/nhl/svg/MTL_dark.svg');
  });

  it('handles season-stamped logos', () => {
    expect(toDarkTeamLogo('https://assets.nhle.com/logos/nhl/svg/UTA_20242025_light.svg'))
      .toBe('https://assets.nhle.com/logos/nhl/svg/UTA_20242025_dark.svg');
  });

  it('leaves other URLs untouched', () => {
    expect(toDarkTeamLogo('https://example.com/logo.png')).toBe('https://example.com/logo.png');
  });
});

describe('isSamsungForcedDark', () => {
  it('is true for Samsung Internet in dark mode', () => {
    expect(isSamsungForcedDark(SAMSUNG_UA, true)).toBe(true);
  });

  it('is false for Samsung Internet in light mode', () => {
    expect(isSamsungForcedDark(SAMSUNG_UA, false)).toBe(false);
  });

  it('is false for other browsers in dark mode', () => {
    expect(isSamsungForcedDark(CHROME_UA, true)).toBe(false);
  });
});
