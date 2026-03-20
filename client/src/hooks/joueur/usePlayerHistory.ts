import { useQuery } from '@tanstack/react-query';
import { PlayerHistoryResponse } from '@/types/IHistoire';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchPlayerHistory = async (nhlId: string): Promise<PlayerHistoryResponse> => {
  const response = await fetch(`${BACKEND_URL}/api/players/${nhlId}/history`);
  if (!response.ok) throw new Error("Erreur lors de la récupération de l'historique");
  return (await response.json()).data;
};

export function usePlayerHistory(nhlId: string) {
  return useQuery<PlayerHistoryResponse>({
    queryKey: ['player-history', nhlId],
    queryFn: () => fetchPlayerHistory(nhlId),
    enabled: !!nhlId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
