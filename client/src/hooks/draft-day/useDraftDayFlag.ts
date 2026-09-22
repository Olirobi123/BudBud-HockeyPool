import { useQuery } from '@tanstack/react-query';
import type { DraftDayFlag } from '@/types/IDraftDay';
import { fetchDraftDay } from './fetchDraftDay';

// eslint-disable-next-line import/prefer-default-export
export function useDraftDayFlag() {
  return useQuery<DraftDayFlag>({
    queryKey: ['draft-day', 'flag'],
    queryFn: () => fetchDraftDay<DraftDayFlag>('', 'Erreur lors de la vérification du mode repêchage'),
    staleTime: 60 * 1000,
  });
}
