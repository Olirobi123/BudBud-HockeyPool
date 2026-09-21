import { useSyncExternalStore } from 'react';
import { isSamsungForcedDark } from '@/lib/teamLogo';

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  return isSamsungForcedDark(navigator.userAgent, window.matchMedia(DARK_QUERY).matches);
}

/** True while Samsung Internet is force-darkening the page. See lib/teamLogo.ts. */
export function useSamsungForcedDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
