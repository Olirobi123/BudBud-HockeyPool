import { useQuery } from '@tanstack/react-query';
import { HomeTrade } from '@/types/IHome';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchRecentTrades = async (limit: number): Promise<HomeTrade[]> => {
  const response = await fetch(`${BACKEND_URL}/api/echanges/recent?limit=${limit}`);
  const json = await response.json();
  return json.success ? (json.data ?? []) : [];
};

/**
 * Les derniers échanges, du plus récent au plus ancien.
 *
 * La page d'accueil en demande plus qu'elle n'en affichera : le nombre de
 * cartes qui tiennent dans la colonne dépend de la hauteur du tableau voisin,
 * et n'est connu qu'après mesure.
 */
// eslint-disable-next-line import/prefer-default-export
export function useRecentTrades(limit: number) {
  return useQuery<HomeTrade[]>({
    queryKey: ['recentTrades', limit],
    queryFn: () => fetchRecentTrades(limit),
  });
}
