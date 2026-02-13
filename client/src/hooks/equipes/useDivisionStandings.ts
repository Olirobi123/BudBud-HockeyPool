import { useQuery } from '@tanstack/react-query';
import { TeamStanding } from '@/types/IEquipes';
import { BACKEND_URL } from '@/lib/apiConfig';

interface RankingResponse {
  equipe_id: number;
  equipe_nom: string;
  division: 'nord' | 'sud';
  total_points: number;
  dg_name?: string;
}

const fetchDivisionStandings = async (
  division: 'nord' | 'sud'
): Promise<TeamStanding[]> => {
  const response = await fetch(
    `${BACKEND_URL}/api/points/rankings/${division}`
  );
  if (!response.ok) {
    throw new Error(`Erreur lors du chargement du classement ${division}`);
  }
  const result = await response.json();
  const rankings: RankingResponse[] = result.data || [];
  return rankings.map((r, index) => ({
    id: r.equipe_id,
    nom: r.equipe_nom,
    division: r.division,
    rank: index + 1,
    total_points: r.total_points,
    dg_name: r.dg_name,
  }));
};

export function useDivisionStandings(division: 'nord' | 'sud') {
  return useQuery<TeamStanding[]>({
    queryKey: ['division-standings', division],
    queryFn: () => fetchDivisionStandings(division),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
