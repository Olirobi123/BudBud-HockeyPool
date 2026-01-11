import { useQuery } from '@tanstack/react-query';
import { HomeTrade } from '@/types/IHome';

const fetchLatestTrade = async (): Promise<HomeTrade | undefined> => {
  const response = await fetch('/api/echanges/latest');
  const json = await response.json();
  return json.success ? json.data : undefined;
};

export function useLatestTrade() {
  return useQuery<HomeTrade | undefined>({
    queryKey: ['latestTrade'],
    queryFn: fetchLatestTrade,
  });
}
