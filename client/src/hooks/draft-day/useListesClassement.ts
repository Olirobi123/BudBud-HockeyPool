import { useQuery } from '@tanstack/react-query';
import type { ListeClassement } from '@/types/IDraftDay';
import { fetchDraftDay } from './fetchDraftDay';

// eslint-disable-next-line import/prefer-default-export
export function useListesClassement() {
  return useQuery<ListeClassement[]>({
    queryKey: ['draft-day', 'listes'],
    queryFn: () => fetchDraftDay<ListeClassement[]>('/listes', 'Erreur lors du chargement des listes'),
    staleTime: 10 * 60 * 1000,
  });
}
