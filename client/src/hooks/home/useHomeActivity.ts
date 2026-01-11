import { useQuery } from '@tanstack/react-query';
import { HomeActivity } from '@/types/IHome';

const fetchHomeActivity = async (): Promise<HomeActivity[]> => {
  const response = await fetch('/api/echanges/activity');
  const json = await response.json();
  return json.success ? json.data : [];
};

export function useHomeActivity() {
  return useQuery<HomeActivity[]>({
    queryKey: ['homeActivity'],
    queryFn: fetchHomeActivity,
  });
}
