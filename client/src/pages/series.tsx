import { useState } from 'react';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';
import { PlayoffBracket } from '@/components/series/PlayoffBracket';
import { Skeleton } from '@/components/ui/skeleton';
import { useSeries } from '@/hooks/series/useSeries';

// First year playoffs were tracked; upper bound = current season end year
const FIRST_YEAR = 2026;
const now = new Date();
const LAST_YEAR = Math.max(FIRST_YEAR, now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear());

function yearToSaison(year: number): string {
  return `${year - 1}${year}`;
}

function SeriesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, col) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={col} className="flex flex-col gap-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: col === 0 ? 4 : col === 1 ? 2 : 1 }).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={i} className="rounded-xl border border-border/40 overflow-hidden">
              <Skeleton className="h-10 w-full" />
              <div className="h-px bg-border/40" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Series(): JSX.Element {
  const [selectedYear, setSelectedYear] = useState<number>(LAST_YEAR);
  const saison = yearToSaison(selectedYear);
  const { data, isLoading, error } = useSeries(saison);

  return (
    <Layout bgClassName="bg-background" mainPadding="py-12">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-wide">
            Séries Éliminatoires
          </h1>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setSelectedYear((y) => Math.max(FIRST_YEAR, y - 1))}
          disabled={selectedYear <= FIRST_YEAR}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Année précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-foreground tabular-nums min-w-[7rem] text-center">
          {`Saison ${selectedYear - 1}–${selectedYear}`}
        </span>
        <button
          type="button"
          onClick={() => setSelectedYear((y) => Math.min(LAST_YEAR, y + 1))}
          disabled={selectedYear >= LAST_YEAR}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Année suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {isLoading && <SeriesSkeleton />}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-center">
          <p className="text-sm text-red-400">
            Erreur lors du chargement des séries. Veuillez réessayer.
          </p>
        </div>
      )}

      {!isLoading && !error && (!data || data.quartsDeFinale.length === 0) && (
        <div className="rounded-xl border border-border/40 px-4 py-12 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {`Aucune série disponible pour la saison ${selectedYear - 1}–${selectedYear}.`}
          </p>
        </div>
      )}

      {!isLoading && !error && data && data.quartsDeFinale.length > 0 && (
        <PlayoffBracket data={data} />
      )}
    </Layout>
  );
}
