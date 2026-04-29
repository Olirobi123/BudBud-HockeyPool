import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { PointsProgressionChart } from '@/components/bilan/PointsProgressionChart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePointsMensuel } from '@/hooks/bilan/usePointsMensuel';
import { usePageLoading } from '@/hooks/usePageLoading';

// Seasons for which we have monthly data
const SEASONS = [
  { value: '20242025', label: '24-25' },
  { value: '20232024', label: '23-24' },
  { value: '20222023', label: '22-23' },
];

function ChartSkeleton(): JSX.Element {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
}

export default function Bilan(): JSX.Element {
  const [season, setSeason] = useState(SEASONS[0].value);
  const { data, isLoading } = usePointsMensuel(season);

  usePageLoading({ dependencies: [isLoading] });

  return (
    <Layout bgClassName="bg-background">
      <div className="py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-wide">
              Bilan de saison
            </h1>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        </div>

        {/* Season selector */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Saison
          </span>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEASONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chart section */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Progression des points cumulatifs
            </h2>
          </div>
          {isLoading && <ChartSkeleton />}
          {!isLoading && data && data.length > 0 && (
            <PointsProgressionChart data={data} />
          )}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-muted-foreground text-sm text-center py-16">
              Aucune donnée disponible pour cette saison.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
