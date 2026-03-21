import { useQuery } from '@tanstack/react-query';
import { SeriesData, SeriesMatchup, SeriesTeamWeek } from '@/types/ISeries';
import { BACKEND_URL } from '@/lib/apiConfig';

interface RawSemainePoints {
  equipe_id: number;
  equipe_nom: string;
  division: string;
  total_points: number;
  total_buts: number;
  total_matchs: number;
  attaque_points: number;
  defense_points: number;
  gardien_points: number;
}

interface RawSeriesResponse {
  saison: string;
  quartsDeFinale: SeriesMatchup[];
  demiFinales: SeriesMatchup[];
  finale: SeriesMatchup | null;
  rondeActive: 1 | 2 | 3 | null;
  weekPoints: Record<string, RawSemainePoints[]>;
}

function enrichMatchup(
  matchup: SeriesMatchup,
  weekPoints: RawSemainePoints[],
): SeriesMatchup {
  const weekMap = new Map<number, RawSemainePoints>(weekPoints.map((w) => [w.equipe_id, w]));

  const toTeamWeek = (id: number | null, nom?: string): SeriesTeamWeek | undefined => {
    if (id === null) return undefined;
    const w = weekMap.get(id);
    return {
      equipe_id: id,
      equipe_nom: w?.equipe_nom ?? nom ?? '',
      division: w?.division ?? '',
      total_points: w?.total_points ?? 0,
      total_matchs: w?.total_matchs ?? 0,
      attaque_points: w?.attaque_points ?? 0,
      defense_points: w?.defense_points ?? 0,
      gardien_points: w?.gardien_points ?? 0,
      ppg: w && w.total_matchs > 0 ? w.total_points / w.total_matchs : 0,
    };
  };

  return {
    ...matchup,
    equipeA: toTeamWeek(matchup.equipe_a_id, matchup.equipe_a_nom),
    equipeB: toTeamWeek(matchup.equipe_b_id, matchup.equipe_b_nom),
  };
}

const fetchSeries = async (saison?: string): Promise<SeriesData> => {
  const url = saison
    ? `${BACKEND_URL}/api/series?saison=${saison}`
    : `${BACKEND_URL}/api/series`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des séries');
  }
  const result = await response.json();
  const raw: RawSeriesResponse = result.data;

  return {
    saison: raw.saison,
    rondeActive: raw.rondeActive,
    quartsDeFinale: raw.quartsDeFinale.map((m) => enrichMatchup(m, raw.weekPoints['1'] ?? [])),
    demiFinales: raw.demiFinales.map((m) => enrichMatchup(m, raw.weekPoints['2'] ?? [])),
    finale: raw.finale ? enrichMatchup(raw.finale, raw.weekPoints['3'] ?? []) : null,
    weekPoints: Object.fromEntries(
      Object.entries(raw.weekPoints).map(([k, v]) => [
        k,
        (v as RawSemainePoints[]).map((w) => ({
          ...w,
          ppg: w.total_matchs > 0 ? w.total_points / w.total_matchs : 0,
        })),
      ]),
    ),
  };
};

const FIVE_MINUTES = 5 * 60 * 1000;

export function useSeries(saison?: string) {
  return useQuery<SeriesData>({
    queryKey: ['series', saison ?? 'current'],
    queryFn: () => fetchSeries(saison),
    staleTime: FIVE_MINUTES,
    gcTime: FIVE_MINUTES,
  });
}
