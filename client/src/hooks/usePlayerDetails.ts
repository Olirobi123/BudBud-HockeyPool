import { useQuery } from '@tanstack/react-query';
import PlayerDetails from '@/types/IPlayerDetails';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchPlayerDetails = async (playerId: string): Promise<PlayerDetails> => {
  const response = await fetch(`${BACKEND_URL}/api/players/${playerId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des détails du joueur');
  }
  const result = await response.json();
  return result.data;
};

export function usePlayerDetails(playerId: string) {
  return useQuery<PlayerDetails>({
    queryKey: ['player', playerId],
    queryFn: () => fetchPlayerDetails(playerId),
    enabled: !!playerId,
  });
}
