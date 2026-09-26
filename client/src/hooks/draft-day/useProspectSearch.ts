import { useQuery } from '@tanstack/react-query';
import type { DraftProspectSearchResult } from '@/types/IDraftDay';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { fetchDraftDay } from './fetchDraftDay';

// On attend 3 lettres et une pause de frappe (SEARCH_DEBOUNCE_MS) avant d'interroger la LNH.
export const PROSPECT_SEARCH_MIN_LENGTH = 3;

/** Recherche NHL pour la régie. `isWaiting` : la frappe n'est pas encore envoyée. */
export function useProspectSearch(query: string) {
  const debounced = useDebouncedValue(query.trim());

  const search = useQuery<DraftProspectSearchResult[]>({
    queryKey: ['draft-day', 'regie-recherche', debounced],
    queryFn: () => fetchDraftDay<DraftProspectSearchResult[]>(
      `/regie/recherche?q=${encodeURIComponent(debounced)}`,
      'Erreur lors de la recherche NHL',
    ),
    enabled: debounced.length >= PROSPECT_SEARCH_MIN_LENGTH,
    staleTime: 5 * 60 * 1000,
  });

  return { ...search, isWaiting: query.trim() !== debounced };
}
