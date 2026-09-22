import { useQuery } from '@tanstack/react-query';
import type { ListeClassementJoueur } from '@/types/IDraftDay';
import { fetchDraftDay } from './fetchDraftDay';

// La colonne « Propriétaire » suit le draft en direct.
const REFRESH_MS = 30 * 1000;

// eslint-disable-next-line import/prefer-default-export
export function useListeJoueurs(listeId: number | null) {
  return useQuery<ListeClassementJoueur[]>({
    queryKey: ['draft-day', 'liste', listeId],
    queryFn: () => fetchDraftDay<ListeClassementJoueur[]>(
      `/listes/${listeId}`,
      'Erreur lors du chargement de la liste',
    ),
    enabled: listeId !== null,
    refetchInterval: REFRESH_MS,
  });
}
