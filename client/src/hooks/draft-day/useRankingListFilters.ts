import { useMemo, useState } from 'react';
import type {
  ListeClassementJoueur,
  ListeOwnershipFilter,
  ListePositionFilter,
} from '@/types/IDraftDay';
import { filterRankingList, RANKING_LIST_PAGE_SIZE } from '@/lib/rankingListFilter';

/**
 * Filtres + pagination côté client (une liste fait au plus quelques centaines de lignes).
 * Tout changement de filtre ramène à la page 1.
 */
// eslint-disable-next-line import/prefer-default-export
export function useRankingListFilters(joueurs: ListeClassementJoueur[]) {
  const [position, setPositionState] = useState<ListePositionFilter>('ALL');
  const [ownership, setOwnershipState] = useState<ListeOwnershipFilter>('ALL');
  const [search, setSearchState] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => filterRankingList(joueurs, { position, ownership, search }),
    [joueurs, position, ownership, search],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / RANKING_LIST_PAGE_SIZE));
  // La liste se rafraîchit pendant le draft : ne jamais pointer au-delà de la dernière page.
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (currentPage - 1) * RANKING_LIST_PAGE_SIZE,
    currentPage * RANKING_LIST_PAGE_SIZE,
  );

  const resetting = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return {
    position,
    setPosition: resetting(setPositionState),
    ownership,
    setOwnership: resetting(setOwnershipState),
    search,
    setSearch: resetting(setSearchState),
    page: currentPage,
    setPage,
    pageCount,
    pageItems,
    filteredCount: filtered.length,
    resetAll: () => {
      setPositionState('ALL');
      setOwnershipState('ALL');
      setSearchState('');
      setPage(1);
    },
  };
}
