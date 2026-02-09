import { useQuery } from '@tanstack/react-query';
import { Trophee, TropheeGagnant } from '@/types';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchTrophees = async (): Promise<Trophee[]> => {
  const response = await fetch(`${BACKEND_URL}/api/trophees`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des trophées');
  }
  const result = await response.json();
  return result.data;
};

const fetchTeamTrophies = async (teamId: number): Promise<TropheeGagnant[]> => {
  const response = await fetch(`${BACKEND_URL}/api/trophees/equipe/${teamId}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des trophées de l\'équipe');
  }
  const result = await response.json();
  return result.data || [];
};

const fetchWinnersByYear = async (year: number): Promise<TropheeGagnant[]> => {
  const response = await fetch(`${BACKEND_URL}/api/trophees/gagnants/${year}`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des gagnants');
  }
  const result = await response.json();
  return result.data || [];
};

const fetchAllWinners = async (): Promise<TropheeGagnant[]> => {
  const response = await fetch(`${BACKEND_URL}/api/trophees/gagnants`);
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des gagnants');
  }
  const result = await response.json();
  return result.data || [];
};

export function useTrophees() {
  return useQuery<Trophee[]>({
    queryKey: ['trophees'],
    queryFn: fetchTrophees,
  });
}

export function useTeamTrophies(teamId: number) {
  return useQuery<TropheeGagnant[]>({
    queryKey: ['team-trophies', teamId],
    queryFn: () => fetchTeamTrophies(teamId),
    enabled: !!teamId,
  });
}

export function useTropheeWinnersByYear(year: number) {
  return useQuery<TropheeGagnant[]>({
    queryKey: ['trophee-winners', year],
    queryFn: () => fetchWinnersByYear(year),
    enabled: !!year,
  });
}

export function useAllTropheeWinners() {
  return useQuery<TropheeGagnant[]>({
    queryKey: ['all-trophee-winners'],
    queryFn: fetchAllWinners,
  });
}
