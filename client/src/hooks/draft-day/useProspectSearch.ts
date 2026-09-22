import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DraftProspectSearchResult } from '@/types/IDraftDay';
import { fetchDraftDay } from './fetchDraftDay';

const DEBOUNCE_MS = 250;
const MIN_LENGTH = 2;

/** Recherche NHL (prospects compris) pour la régie, avec un léger délai de frappe. */
// eslint-disable-next-line import/prefer-default-export
export function useProspectSearch(query: string) {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return useQuery<DraftProspectSearchResult[]>({
    queryKey: ['draft-day', 'regie-recherche', debounced],
    queryFn: () => fetchDraftDay<DraftProspectSearchResult[]>(
      `/regie/recherche?q=${encodeURIComponent(debounced)}`,
      'Erreur lors de la recherche NHL',
    ),
    enabled: debounced.length >= MIN_LENGTH,
    staleTime: 5 * 60 * 1000,
  });
}
