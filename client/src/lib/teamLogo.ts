/*
 * NHL logos come in two variants: `_light.svg` (drawn for a light background)
 * and `_dark.svg` (light outlines, for a dark background). The site is light
 * only, so `_light` is the default everywhere.
 *
 * Samsung Internet's own "Dark mode" setting darkens every page, ignoring
 * `color-scheme: only light`, but leaves images alone — so the `_light` logos
 * end up on a dark background. When that mode is on, the browser reports
 * `prefers-color-scheme: dark`, which is the signal used to swap variants.
 */

const SAMSUNG_BROWSER = /SamsungBrowser/i;

export function isSamsungForcedDark(userAgent: string, prefersDark: boolean): boolean {
  return prefersDark && SAMSUNG_BROWSER.test(userAgent);
}

export function toDarkTeamLogo(src: string): string {
  return src.replace(/_light\.svg$/, '_dark.svg');
}
