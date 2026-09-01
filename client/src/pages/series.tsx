import { useState } from 'react';
import { Trophy } from 'lucide-react';
import Layout from '@/components/Layout';
import { PlayoffBracket } from '@/components/series/PlayoffBracket';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSeries } from '@/hooks/series/useSeries';

// First year playoffs were tracked; upper bound = current season end year
const FIRST_YEAR = 2023;
const now = new Date();
const LAST_YEAR = Math.max(FIRST_YEAR, now.getMonth() >= 8 ? now.getFullYear() + 1 : now.getFullYear());

const YEARS = Array.from(
  { length: LAST_YEAR - FIRST_YEAR + 1 },
  (_, i) => LAST_YEAR - i,
);

function yearToSaison(year: number): string {
  return `${year - 1}${year}`;
}

function yearLabel(year: number): string {
  return `${year - 1}-${String(year).slice(2)}`;
}

function SeriesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 shrink-0" />
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-wide truncate">
            Séries Éliminatoires
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Saison
          </span>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="w-[6rem] h-8 text-xs font-semibold border-border/60 bg-muted/30 hover:bg-muted/60 focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={String(year)} className="text-xs">
                  {yearLabel(year)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        <div className="rounded-xl border border-border/40 px-4 py-12 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {`Aucune série disponible pour la saison ${yearLabel(selectedYear)}.`}
          </p>
        </div>
      )}

      {!isLoading && !error && data && data.quartsDeFinale.length > 0 && (
        <PlayoffBracket data={data} />
      )}
    </Layout>
  );
}
