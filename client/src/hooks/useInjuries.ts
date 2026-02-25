import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';
import { InjuryInfo } from '@/types/IInjury';

const fetchInjuries = async (): Promise<Record<number, InjuryInfo>> => {
  const response = await fetch(`${BACKEND_URL}/api/injuries`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des blessures');
  }
  const result = await response.json();
  return result.data;
};

export function useInjuries() {
  return useQuery<Record<number, InjuryInfo>>({
    queryKey: ['injuries'],
    queryFn: fetchInjuries,
    staleTime: 60 * 60 * 1000, // 1h — refreshed once daily by cron
    gcTime: 2 * 60 * 60 * 1000,
  });
}
