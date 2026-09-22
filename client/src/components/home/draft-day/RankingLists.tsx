import { JSX, useState } from 'react';
import { ListChecks } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Skeleton } from '@/components/ui/skeleton';
import { useListesClassement } from '@/hooks/draft-day/useListesClassement';
import { RankingListPanel } from './RankingListPanel';
import { RankingListPicker } from './RankingListPicker';
import { RankingListSkeleton } from './RankingListSkeleton';
import { SectionHeading } from './SectionHeading';

// eslint-disable-next-line import/prefer-default-export
export function RankingLists(): JSX.Element {
  const { data: listes = [], isLoading, error } = useListesClassement();
  const [pickedId, setPickedId] = useState<number | null>(null);

  const selected = listes.find((l) => l.id === pickedId) ?? listes[0];

  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-9 w-full sm:w-80" />
          <RankingListSkeleton />
        </div>
      );
    }
    if (error !== null) return <ErrorDisplay error={error} />;
    if (selected === undefined) return <EmptyState icon={ListChecks} message="Aucune liste publiée pour le moment" />;

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          {listes.length > 1 ? (
            <RankingListPicker listes={listes} selectedId={selected.id} onChange={setPickedId} />
          ) : (
            <p className="font-display text-lg font-semibold text-foreground">{selected.nom}</p>
          )}
          {selected.auteur !== null && (
            <p className="text-xs text-muted-foreground">{selected.auteur}</p>
          )}
        </div>
        <RankingListPanel key={selected.id} listeId={selected.id} />
      </div>
    );
  };

  return (
    <section aria-labelledby="ranking-lists-title" className="space-y-4">
      <SectionHeading id="ranking-lists-title" title="Listes publiques" />
      <Card>
        <CardContent className="p-4 sm:p-6">{renderContent()}</CardContent>
      </Card>
    </section>
  );
}
