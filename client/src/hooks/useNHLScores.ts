import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { GameScore } from '@/types';

interface ApiResponse {
  success: boolean;
  data: GameScore[];
}

const fetchNHLScores = async (): Promise<GameScore[]> => {
  const response = await fetch('/api/scores');
  const json: ApiResponse = await response.json();
  return json.success === true ? json.data : [];
};

export default function useNHLScores(): UseQueryResult<GameScore[], Error> {
  return useQuery<GameScore[]>({
    queryKey: ['nhlScores'],
    queryFn: fetchNHLScores,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
