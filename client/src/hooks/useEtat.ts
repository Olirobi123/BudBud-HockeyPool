import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';
import { EtatInfo } from '@/types/IEtat';

const fetchEtat = async (): Promise<Record<number, EtatInfo>> => {
  const response = await fetch(`${BACKEND_URL}/api/etat`);
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'état des joueurs");
  }
  const result = await response.json();
  return result.data;
};

export function useEtat() {
  return useQuery<Record<number, EtatInfo>>({
    queryKey: ['etat'],
    queryFn: fetchEtat,
    staleTime: 60 * 60 * 1000, // 1h — refreshed once daily by cron
    gcTime: 2 * 60 * 60 * 1000,
  });
}
