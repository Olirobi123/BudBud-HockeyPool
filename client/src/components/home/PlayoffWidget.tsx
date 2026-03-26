import { Link } from 'react-router-dom';
import { Trophy, ArrowRight } from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BracketCard } from '@/components/series/BracketCard';
import { useSeries } from '@/hooks/series/useSeries';
import { SeriesMatchup } from '@/types/ISeries';

const ROUND_LABELS: Record<1 | 2 | 3, string> = {
  1: 'Quarts de finale',
  2: 'Demi-finales',
  3: 'Grande Finale',
};

function PlayoffWidgetSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
          {/* Header label row */}
          <div className="px-3 py-1.5 border-b border-border/40 bg-muted/20">
            <Skeleton className="h-3 w-24" />
          </div>
          {/* Team row A */}
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-8 shrink-0" />
          </div>
          {/* Divider */}
          <div className="border-t border-border/40" />
          {/* Team row B */}
          <div className="flex items-center gap-2.5 px-3 py-2.5">
            <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-8 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MatchupLabel(matchup: SeriesMatchup): string {
  if (matchup.ronde === 3) return 'Grande Finale';
  return matchup.division === 'nord' ? 'Division Nord' : 'Division Sud';
}

export function PlayoffWidget(): JSX.Element | null {
  const { data, isLoading } = useSeries();

  // Don't render if no active round
  if (!isLoading && (!data || data.rondeActive === null)) return null;

  const rondeActive = data?.rondeActive ?? null;

  const activeMatchups: SeriesMatchup[] = (() => {
    if (!data || rondeActive === null) return [];
    if (rondeActive === 1) return data.quartsDeFinale;
    if (rondeActive === 2) return data.demiFinales;
    if (rondeActive === 3 && data.finale) return [data.finale];
    return [];
  })();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>
              {rondeActive !== null ? ROUND_LABELS[rondeActive] : 'Séries éliminatoires'}
            </span>
          </CardTitle>
          <Link
            to="/series"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Voir le bracket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <PlayoffWidgetSkeleton />}
        {!isLoading && activeMatchups.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucune série en cours
          </p>
        )}
        {!isLoading && activeMatchups.length > 0 && (
          <div className="space-y-3">
            {activeMatchups.map((m) => (
              <BracketCard
                key={m.id}
                matchup={m}
                label={MatchupLabel(m)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
