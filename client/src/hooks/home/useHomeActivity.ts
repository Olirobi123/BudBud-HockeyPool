import { useQuery } from '@tanstack/react-query';
import { HomeActivity } from '@/types/IHome';

const fetchHomeActivity = async (): Promise<HomeActivity[]> => {
  // TODO: Brancher sur l'API réelle pour récupérer le feed d'activité
  return [];
};

export function useHomeActivity() {
  return useQuery<HomeActivity[]>({
    queryKey: ['homeActivity'],
    queryFn: fetchHomeActivity,
  }); 
} 