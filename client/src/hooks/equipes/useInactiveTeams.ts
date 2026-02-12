import { useQuery } from '@tanstack/react-query';
import Equipe from '@/types/IEquipes';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchInactiveTeams = async (): Promise<Equipe[]> => {
  const response = await fetch(`${BACKEND_URL}/api/teams/inactive`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des équipes inactives');
  }
  const result = await response.json();
  return result.data || [];
};

export function useInactiveTeams() {
  return useQuery<Equipe[]>({
    queryKey: ['inactive-teams'],
    queryFn: fetchInactiveTeams,
  });
}
