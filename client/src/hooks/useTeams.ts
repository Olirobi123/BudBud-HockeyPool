import { useQuery } from '@tanstack/react-query';
import Equipe from '@/types/IEquipes';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchTeams = async (): Promise<Equipe[]> => {
  const response = await fetch(`${BACKEND_URL}/api/teams`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des équipes');
  }
  const result = await response.json();
  return result.data || [];
};

export function useTeams() {
  return useQuery<Equipe[]>({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
}
