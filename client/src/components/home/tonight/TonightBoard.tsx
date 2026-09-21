import { JSX } from 'react';
import { AlertCircle } from 'lucide-react';
import useNHLScores from '@/hooks/useNHLScores';
import { useLivePoints } from '@/hooks/home/useLivePoints';
import { TonightMeta } from './TonightMeta';
import { ScoreboardRail } from './ScoreboardRail';
import { TonightBoardSkeleton } from './TonightBoardSkeleton';

/**
 * The home page hero: what is happening in the league right now, in two
 * bands — meta and tonight's games. Tonight's pool movement is left to the
 * cards below, which already show it.
 *
 * Thin wrapper per the convention in CLAUDE.md: it owns the two queries and
 * the loading/error/empty states, and delegates all rendering to the
 * presentational children beside it.
 */
// eslint-disable-next-line import/prefer-default-export
export function TonightBoard(): JSX.Element {
  const {
    data: games, isLoading: scoresLoading, isError: scoresError, dataUpdatedAt,
  } = useNHLScores();
  const { data: livePoints, isLoading: pointsLoading } = useLivePoints();

  const isLoading = scoresLoading || pointsLoading;

  return (
    <section
      aria-label="Sommaire de la soirée"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isLoading ? (
          <TonightBoardSkeleton />
        ) : (
          <div className="space-y-6">
            <TonightMeta
              gamesCount={games?.length ?? 0}
              liveGamesCount={livePoints?.liveGamesCount ?? 0}
              updatedAt={dataUpdatedAt}
            />

            {scoresError ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-6 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-destructive" />
                Impossible de charger les scores pour le moment.
              </div>
            ) : (
              <ScoreboardRail games={games ?? []} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
