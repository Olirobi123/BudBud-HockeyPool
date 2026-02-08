import { useQuery } from '@tanstack/react-query';
import Echange from '@/types/IEchange';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchEchanges = async (): Promise<Echange[]> => {
  const response = await fetch(`${BACKEND_URL}/api/echanges`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des échanges');
  }
  const result = await response.json();
  return result.data || [];
};

export function useEchanges() {
  return useQuery<Echange[]>({
    queryKey: ['echanges'],
    queryFn: fetchEchanges,
  });
}
