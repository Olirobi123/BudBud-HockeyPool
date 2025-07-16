import { useQuery } from '@tanstack/react-query';
import { DraftType } from '@/types/IDraft';

const fetchDraftTypes = async (): Promise<DraftType[]> => {
  const response = await fetch('/api/repechage/types');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des types de repêchage');
  }
  return response.json();
};

export function useDraftTypes() {
  return useQuery<DraftType[]>({
    queryKey: ['typesRepechage'],
    queryFn: fetchDraftTypes,
  });
} 