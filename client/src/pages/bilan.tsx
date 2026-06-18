import Layout from '@/components/Layout';
import { BilanTable } from '@/components/bilan/BilanTable';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePointsMensuel } from '@/hooks/bilan/usePointsMensuel';
import { useSaisons } from '@/hooks/bilan/useSaisons';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useState } from 'react';

export default function Bilan(): JSX.Element {
  const { data: saisons } = useSaisons();
  const [season, setSeason] = useState('');
  const activeSeason = season !== '' ? season : (saisons?.[0]?.value ?? '');
  const { data, isLoading } = usePointsMensuel(activeSeason);

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
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Saison
          </span>
          <Select value={activeSeason} onValueChange={setSeason}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(saisons ?? []).map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-xl p-6">
          {isLoading && <Skeleton className="h-[420px] w-full rounded-xl" />}

          {!isLoading && (!data || data.length === 0) && (
            <p className="text-muted-foreground text-sm text-center py-16">
              Aucune donnée disponible pour cette saison.
            </p>
          )}

          {!isLoading && data && data.length > 0 && (
            <BilanTable data={data} />
          )}
        </div>
      </div>
    </Layout>
  );
}
