import { useQuery } from '@tanstack/react-query';
import { Equipe, Echange } from '@/types';

const fetchTeam = async (id: number): Promise<Equipe> => {
  const response = await fetch(`/api/teams/${id}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération de l\'équipe');
  }
  const result = await response.json();
  return result.data;
};

const fetchTeamRoster = async (id: number): Promise<any[]> => {
  const response = await fetch(`/api/teams/${id}/roster`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du roster');
  }
  const result = await response.json();
  return result.data || [];
};

const fetchTeamLatestTrade = async (id: number): Promise<Echange | null> => {
  const response = await fetch(`/api/teams/${id}/latest-trade`);
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
  return useQuery<any[]>({
    queryKey: ['team-roster', id],
    queryFn: () => fetchTeamRoster(id),
    enabled: !!id,
  });
}

export function useTeamLatestTrade(id: number) {
  return useQuery<Echange | null>({
    queryKey: ['team-latest-trade', id],
    queryFn: () => fetchTeamLatestTrade(id),
    enabled: !!id,
  });
}
