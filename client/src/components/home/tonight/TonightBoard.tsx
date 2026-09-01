import { JSX } from 'react';
import { AlertCircle } from 'lucide-react';
import useNHLScores from '@/hooks/useNHLScores';
import { useLivePoints } from '@/hooks/home/useLivePoints';
import { TonightMeta } from './TonightMeta';
import { ScoreboardRail } from './ScoreboardRail';
import { TonightPoolPanel, hasScoredTonight } from './TonightPoolPanel';
import { TonightScorersPanel } from './TonightScorersPanel';
import { TonightBoardSkeleton } from './TonightBoardSkeleton';

function PanelHeading({ children }: { children: string }): JSX.Element {
  return (
    <h2 className="mb-2 font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h2>
  );
}

/**
 * The home page hero: what is happening in the league and in the pool
 * right now, in three bands — meta, tonight's games, tonight's pool movement.
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

  // The cards further down the page already render their own empty states for
  // this data. Showing empty panels here too would duplicate that message and
  // push the scoreboard up against 300px of dead space, so the band only
  // appears once there is something to report.
  const scoringTeams = livePoints?.teamLeaderboard.filter(hasScoredTonight) ?? [];
  const topPlayers = livePoints?.topPlayers ?? [];
  const hasPoolActivity = scoringTeams.length > 0 || topPlayers.length > 0;

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

            {hasPoolActivity && (
              <div className="grid gap-x-10 gap-y-6 border-t border-border pt-6 sm:grid-cols-2">
                <div>
                  <PanelHeading>Ce soir — Pool</PanelHeading>
                  <TonightPoolPanel teams={scoringTeams} />
                </div>
                <div>
                  <PanelHeading>Marqueurs</PanelHeading>
                  <TonightScorersPanel players={topPlayers} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
