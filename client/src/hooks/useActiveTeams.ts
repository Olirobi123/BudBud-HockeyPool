import { useQuery } from '@tanstack/react-query';
import Equipe from '@/types/IEquipes';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchActiveTeams = async (): Promise<Equipe[]> => {
  const response = await fetch(`${BACKEND_URL}/api/teams/active`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des équipes actives');
  }
  const result = await response.json();
  return result.data || [];
};

export function useActiveTeams() {
  return useQuery<Equipe[]>({
    queryKey: ['teams', 'active'],
    queryFn: fetchActiveTeams,
  });
}
