import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';
import { formatSeasonShort } from '@/lib/utils';

export interface SaisonOption {
  value: string;
  label: string;
}

const fetchSaisons = async (): Promise<SaisonOption[]> => {
  const response = await fetch(`${BACKEND_URL}/api/points/saisons`);
  if (!response.ok) throw new Error('Erreur lors du chargement des saisons');
  const result = await response.json();
  const raw: string[] = result.data ?? [];
  return raw.map((s) => ({
    value: s,
    label: formatSeasonShort(Number(s)),
  }));
};

const ONE_DAY = 24 * 60 * 60 * 1000;

export function useSaisons(): UseQueryResult<SaisonOption[]> {
  return useQuery<SaisonOption[]>({
    queryKey: ['saisons-mensuel'],
    queryFn: fetchSaisons,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
  });
}
