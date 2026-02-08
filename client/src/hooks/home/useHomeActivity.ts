import { useQuery } from '@tanstack/react-query';
import { HomeActivity } from '@/types/IHome';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchHomeActivity = async (): Promise<HomeActivity[]> => {
  const response = await fetch(`${BACKEND_URL}/api/echanges/activity`);
  const json = await response.json();
  return json.success ? json.data : [];
};

export function useHomeActivity() {
  return useQuery<HomeActivity[]>({
    queryKey: ['homeActivity'],
    queryFn: fetchHomeActivity,
  });
}
