import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';

export interface PointsMensuelEntry {
  equipe_id: number;
  equipe_nom: string;
  equipe_nom_court: string;
  mois: number;
  monthly_points: number;
  cumul_points: number;
}

const fetchPointsMensuel = async (season: string): Promise<PointsMensuelEntry[]> => {
  const response = await fetch(`${BACKEND_URL}/api/points/mensuel?season=${season}`);
  if (!response.ok) throw new Error('Erreur lors du chargement des points mensuels');
  const result = await response.json();
  const raw: (Omit<PointsMensuelEntry, 'cumul_points'> & { cumul_points: string | number })[] = result.data ?? [];
  return raw.map((e) => ({ ...e, cumul_points: Number(e.cumul_points) }));
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export function usePointsMensuel(season: string): UseQueryResult<PointsMensuelEntry[]> {
  return useQuery<PointsMensuelEntry[]>({
    queryKey: ['points-mensuel', season],
    queryFn: () => fetchPointsMensuel(season),
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
    enabled: !!season,
  });
}
