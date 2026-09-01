import { JSX, useEffect, useState } from 'react';
import { getCurrentSeasonLabel } from '@/lib/season';

/** Relative freshness label, e.g. "il y a 12 s" / "il y a 3 min". */
function formatAge(ms: number): string {
  const seconds = Math.max(0, Math.round(ms / 1000));
  if (seconds < 60) return `il y a ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `il y a ${hours} h`;
}

interface TonightMetaProps {
  gamesCount: number;
  liveGamesCount: number;
  /** `dataUpdatedAt` from TanStack Query — no extra state needed. */
  updatedAt: number;
}

// eslint-disable-next-line import/prefer-default-export
export function TonightMeta({
  gamesCount, liveGamesCount, updatedAt,
}: TonightMetaProps): JSX.Element {
  // The timestamp is fixed between fetches, so tick locally to keep the
  // "il y a N s" label honest rather than frozen.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const today = new Date().toLocaleDateString('fr-CA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
      <span className="font-display font-semibold uppercase tracking-wider text-foreground">
        {today}
      </span>

      <span className="text-border" aria-hidden="true">·</span>

      <span className="text-muted-foreground">
        {gamesCount}
        {gamesCount === 1 ? ' match' : ' matchs'}
      </span>

      {liveGamesCount > 0 && (
        <>
          <span className="text-border" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-live">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
            </span>
            {liveGamesCount}
            {' '}
            en cours
          </span>
        </>
      )}

      <span className="ml-auto flex items-center gap-3 text-muted-foreground">
        <span className="hidden font-display uppercase tracking-wider sm:inline">
          {getCurrentSeasonLabel()}
        </span>
        {updatedAt > 0 && (
          <span className="tabular-nums">
            maj.
            {' '}
            {formatAge(now - updatedAt)}
          </span>
        )}
      </span>
    </div>
  );
}
