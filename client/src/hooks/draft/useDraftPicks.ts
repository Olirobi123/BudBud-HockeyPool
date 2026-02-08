import { useQuery } from '@tanstack/react-query';
import { DraftPick } from '@/types/IDraft';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchDraftPicks = async (): Promise<DraftPick[]> => {
  const response = await fetch(`${BACKEND_URL}/api/repechage`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des choix de repêchage');
  }
  const result = await response.json();
  return result.data || [];
};

export function useDraftPicks() {
  return useQuery<DraftPick[]>({
    queryKey: ['draftPicks'],
    queryFn: fetchDraftPicks,
  });
}
