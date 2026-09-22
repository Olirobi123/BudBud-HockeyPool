import { JSX } from 'react';
import { ListOrdered } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useDraftBoard } from '@/hooks/draft-day/useDraftBoard';
import { DraftBoard } from './DraftBoard';
import { DraftBoardSkeleton } from './DraftBoardSkeleton';
import { SectionHeading } from './SectionHeading';

// eslint-disable-next-line import/prefer-default-export
export function DraftBoardSection(): JSX.Element {
  const { data: picks, isLoading, error } = useDraftBoard();
  const made = picks?.filter((p) => p.joueur !== null).length;

  const renderContent = (): JSX.Element => {
    if (isLoading) return <DraftBoardSkeleton />;
    if (error !== null) return <ErrorDisplay error={error} />;
    if (!picks || picks.length === 0) {
      return <EmptyState icon={ListOrdered} message="L'ordre du repêchage n'est pas encore publié" />;
    }
    return <DraftBoard picks={picks} />;
  };

  return (
    <section aria-labelledby="draft-board-title" className="space-y-4">
      <SectionHeading
        id="draft-board-title"
        title="Ordre de repêchage"
        meta={made !== undefined && picks ? `${made} / ${picks.length} choix` : undefined}
      />
      {renderContent()}
    </section>
  );
}
