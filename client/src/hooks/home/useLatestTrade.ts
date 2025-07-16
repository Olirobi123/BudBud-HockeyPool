import { useQuery } from '@tanstack/react-query';
import { HomeTrade } from '@/types/IHome';

const fetchLatestTrade = async (): Promise<HomeTrade | undefined> => {
  // TODO: Brancher sur l'API réelle pour récupérer le dernier échange
  return undefined;
};

export function useLatestTrade() {
  return useQuery<HomeTrade | undefined>({
    queryKey: ['latestTrade'],
    queryFn: fetchLatestTrade,
  });
} 