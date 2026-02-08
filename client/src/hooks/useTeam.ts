import { useQuery } from '@tanstack/react-query';
import { Equipe, Echange, RosterPlayerWithStats } from '@/types';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchTeam = async (id: number): Promise<Equipe> => {
  const response = await fetch(`${BACKEND_URL}/api/teams/${id}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'équipe');
  }
  const result = await response.json();
  return result.data;
};

const fetchTeamRoster = async (id: number): Promise<RosterPlayerWithStats[]> => {
  const response = await fetch(`${BACKEND_URL}/api/teams/${id}/roster/stats`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du roster');
  }
  const result = await response.json();
  return result.data || [];
};

const fetchTeamLatestTrade = async (id: number): Promise<Echange | null> => {
  const response = await fetch(`${BACKEND_URL}/api/teams/${id}/latest-trade`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du dernier échange');
  }
  const result = await response.json();
  return result.data;
};

export function useTeam(id: number) {
  return useQuery<Equipe>({
    queryKey: ['team', id],
    queryFn: () => fetchTeam(id),
    enabled: !!id,
  });
}

export function useTeamRoster(id: number) {
  return useQuery<RosterPlayerWithStats[]>({
    queryKey: ['team-roster', id],
    queryFn: () => fetchTeamRoster(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,  // 10 min - won't refetch while fresh
    gcTime: 30 * 60 * 1000,     // 30 min - keep in cache after unmount
  });
}

export function useTeamLatestTrade(id: number) {
  return useQuery<Echange | null>({
    queryKey: ['team-latest-trade', id],
    queryFn: () => fetchTeamLatestTrade(id),
    enabled: !!id,
  });
}
