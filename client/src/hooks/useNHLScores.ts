import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { GameScore } from '@/types';
import { BACKEND_URL } from '@/lib/apiConfig';
import { hasLiveGame } from '@/components/scores/gameState';

interface ApiResponse {
  success: boolean;
  data: GameScore[];
}

/** Poll hard while games are in progress, back off to a slow heartbeat otherwise. */
const LIVE_INTERVAL_MS = 30 * 1000;
const IDLE_INTERVAL_MS = 5 * 60 * 1000;

const fetchNHLScores = async (): Promise<GameScore[]> => {
  const response = await fetch(`${BACKEND_URL}/api/scores`);
  const json: ApiResponse = await response.json();
  return json.success === true ? json.data : [];
};

export default function useNHLScores(): UseQueryResult<GameScore[], Error> {
  return useQuery<GameScore[]>({
    queryKey: ['nhlScores'],
    queryFn: fetchNHLScores,
    // A scoreboard that never refetches is just a screenshot, so the previous
    // `staleTime: Infinity` is gone. Cadence follows whether anything is live.
    staleTime: LIVE_INTERVAL_MS,
    refetchInterval: (query) => (
      hasLiveGame(query.state.data) ? LIVE_INTERVAL_MS : IDLE_INTERVAL_MS
    ),
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
