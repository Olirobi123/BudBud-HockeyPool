import { useQuery } from '@tanstack/react-query';
import { TeamPointsRanking } from '@/types/IEquipes';
import { BACKEND_URL } from '@/lib/apiConfig';

interface RankingsResponse {
  equipe_id: number;
  equipe_nom: string;
  division?: string;
  total_points: number;
  attaque_points: number;
  defense_points: number;
  gardien_points: number;
  total_matchs: number;
  attaque_matchs: number;
  defense_matchs: number;
  gardien_matchs: number;
}

const fetchPointsRankings = async (): Promise<TeamPointsRanking[]> => {
  const response = await fetch(`${BACKEND_URL}/api/points/rankings`);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement du classement général');
  }
  const result = await response.json();
  const rankings: RankingsResponse[] = result.data || [];
  return rankings.map((r, index) => ({
    id: r.equipe_id,
    nom: r.equipe_nom,
    division: r.division ?? '',
    rank: index + 1,
    total_points: r.total_points,
    attaque_points: r.attaque_points,
    defense_points: r.defense_points,
    gardien_points: r.gardien_points,
    total_matchs: r.total_matchs,
    attaque_matchs: r.attaque_matchs,
    defense_matchs: r.defense_matchs,
    gardien_matchs: r.gardien_matchs,
  }));
};

const THREE_HOURS = 3 * 60 * 60 * 1000;

// eslint-disable-next-line import/prefer-default-export
export function usePointsRankings() {
  return useQuery<TeamPointsRanking[]>({
    queryKey: ['points-rankings'],
    queryFn: fetchPointsRankings,
    staleTime: THREE_HOURS,
    gcTime: THREE_HOURS,
  });
}
