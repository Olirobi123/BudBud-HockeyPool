import { useQuery } from '@tanstack/react-query';
import { TeamStanding } from '@/types/IEquipes';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchDivisionStandings = async (
  division: 'nord' | 'sud'
): Promise<TeamStanding[]> => {
  const response = await fetch(
    `${BACKEND_URL}/api/teams/division/${division}/standings`
  );
  if (!response.ok) {
    throw new Error(`Erreur lors du chargement du classement ${division}`);
  }
  const result = await response.json();
  return result.data || [];
};

export function useDivisionStandings(division: 'nord' | 'sud') {
  return useQuery<TeamStanding[]>({
    queryKey: ['division-standings', division],
    queryFn: () => fetchDivisionStandings(division),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
