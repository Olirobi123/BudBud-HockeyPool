import { useQuery } from '@tanstack/react-query';
import { DraftPick } from '@/types/IDraft';

const fetchDraftPicks = async (): Promise<DraftPick[]> => {
  const response = await fetch('/api/repechage');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des choix de repêchage');
  }
  return response.json();
};

export function useDraftPicks() {
  return useQuery<DraftPick[]>({
    queryKey: ['draftPicks'],
    queryFn: fetchDraftPicks,
  });
} 