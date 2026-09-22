import { JSX } from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useListeJoueurs } from '@/hooks/draft-day/useListeJoueurs';
import { useRankingListFilters } from '@/hooks/draft-day/useRankingListFilters';
import { RANKING_LIST_PAGE_SIZE } from '@/lib/rankingListFilter';
import { RankingListFilters } from './RankingListFilters';
import { RankingListPagination } from './RankingListPagination';
import { RankingListSkeleton } from './RankingListSkeleton';
import { RankingListTable } from './RankingListTable';

interface RankingListPanelProps {
  listeId: number;
}

/** Une liste : chargement, filtres, tableau paginé. Remonté (key) à chaque changement de liste. */
// eslint-disable-next-line import/prefer-default-export
export function RankingListPanel({ listeId }: RankingListPanelProps): JSX.Element {
  const { data: joueurs = [], isLoading, error } = useListeJoueurs(listeId);
  const filters = useRankingListFilters(joueurs);

  const firstShown = (filters.page - 1) * RANKING_LIST_PAGE_SIZE + 1;
  const lastShown = firstShown + filters.pageItems.length - 1;

  const renderBody = (): JSX.Element => {
    if (isLoading) return <RankingListSkeleton />;
    if (error !== null) return <ErrorDisplay error={error} />;
    if (filters.filteredCount === 0) {
      return (
        <div className="flex flex-col items-center">
          <EmptyState icon={SearchX} message="Aucun joueur ne correspond aux filtres" />
          <Button variant="outline" size="sm" onClick={filters.resetAll}>Réinitialiser les filtres</Button>
        </div>
      );
    }
    return (
      <>
        <RankingListTable joueurs={filters.pageItems} />
        <div className="flex flex-col items-center gap-2 pt-2 sm:flex-row sm:justify-between">
          <p className="text-xs tabular-nums text-muted-foreground">
            {`${firstShown}–${lastShown} sur ${filters.filteredCount}`}
          </p>
          <RankingListPagination page={filters.page} pageCount={filters.pageCount} onPageChange={filters.setPage} />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <RankingListFilters
        position={filters.position}
        onPositionChange={filters.setPosition}
        ownership={filters.ownership}
        onOwnershipChange={filters.setOwnership}
        search={filters.search}
        onSearchChange={filters.setSearch}
      />
      {renderBody()}
    </div>
  );
}
