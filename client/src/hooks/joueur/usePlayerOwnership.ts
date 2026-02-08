import { useQuery } from '@tanstack/react-query';
import { Equipe } from '@/types';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchPlayerOwnership = async (nhlId: string): Promise<Equipe | null> => {
  const response = await fetch(`${BACKEND_URL}/api/players/${nhlId}/ownership`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de la propriété du joueur');
  }
  const result = await response.json();
  return result.data;
};

export function usePlayerOwnership(nhlId: string) {
  return useQuery<Equipe | null>({
    queryKey: ['player-ownership', nhlId],
    queryFn: () => fetchPlayerOwnership(nhlId),
    enabled: !!nhlId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
