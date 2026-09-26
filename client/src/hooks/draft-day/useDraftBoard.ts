import { useQuery } from '@tanstack/react-query';
import type { DraftBoardPick } from '@/types/IDraftDay';
import { fetchDraftDay } from './fetchDraftDay';

// Les choix sont entrés pendant le draft : on recharge le tableau chaque minute.
const REFRESH_MS = 60 * 1000;

// eslint-disable-next-line import/prefer-default-export
export function useDraftBoard() {
  return useQuery<DraftBoardPick[]>({
    queryKey: ['draft-day', 'board'],
    queryFn: () => fetchDraftDay<DraftBoardPick[]>('/board', 'Erreur lors du chargement du repêchage'),
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: true,
  });
}
