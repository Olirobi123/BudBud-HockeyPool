import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TropheeGagnant, GroupedTrophee } from '@/types';
import { BACKEND_URL } from '@/lib/apiConfig';

async function fetchFromApi<T>(path: string, errorMessage: string): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const result = await response.json();
  return result.data ?? [];
}

const fetchTrophies = async (teamId: number): Promise<TropheeGagnant[]> => {
  const response = await fetch(`${BACKEND_URL}/api/trophees/equipe/${teamId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des échanges');
  }
  const result = await response.json();
  return result.data || [];
};

export function useTeamTrophies(teamId: number) {
  return useQuery<TropheeGagnant[] | null>({
    queryKey: ['team-trophies', teamId],
    queryFn: () => fetchTrophies(teamId),
    enabled: !!teamId,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

function groupTrophees(trophees: TropheeGagnant[]): GroupedTrophee[] {
  const grouped = new Map<string, GroupedTrophee>();

  for (const t of trophees) {
    const existing = grouped.get(t.trophee_nom);
    if (existing) {
      existing.annees.push(t.annee);
    } else {
      grouped.set(t.trophee_nom, {
        trophee_nom: t.trophee_nom,
        annees: [t.annee],
        equipe_nom: t.equipe_nom,
      });
    }
  }

  return Array.from(grouped.values());
}

export function useGroupedTrophees(trophees: TropheeGagnant[]) {
  return useMemo(() => {
    const grouped = groupTrophees(trophees);
    return {
      generalTrophees: grouped.filter((t) => t.trophee_nom === 'Général'),
      otherTrophees: grouped.filter((t) => t.trophee_nom !== 'Général'),
    };
  }, [trophees]);
}
