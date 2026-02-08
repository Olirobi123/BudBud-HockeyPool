import { useQuery } from '@tanstack/react-query';
import { DraftType } from '@/types/IDraft';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchDraftTypes = async (): Promise<DraftType[]> => {
  const response = await fetch(`${BACKEND_URL}/api/repechage/types`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des types de repêchage');
  }
  const result = await response.json();
  return result.data || [];
};

export function useDraftTypes() {
  return useQuery<DraftType[]>({
    queryKey: ['typesRepechage'],
    queryFn: fetchDraftTypes,
  });
}
