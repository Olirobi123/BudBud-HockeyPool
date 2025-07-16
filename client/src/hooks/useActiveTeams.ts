import { useQuery } from '@tanstack/react-query';
import Equipe from '@/types/IEquipes';

const fetchActiveTeams = async (): Promise<Equipe[]> => {
  const response = await fetch('/api/teams/active');
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