import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';
import type { LivePointsResponse } from '@/types/ILivePoints';

interface ApiResponse {
  success: boolean;
  data: LivePointsResponse;
}

/**
 * `livePointsService` caches its response for 10 minutes, so a faster poll
 * would just re-receive the same payload. Refetching at half the TTL keeps
 * the worst-case staleness near one cache generation without hammering the
 * endpoint — most of these requests are served straight from that cache.
 */
const REFETCH_INTERVAL_MS = 5 * 60 * 1000;

const fetchLivePoints = async (): Promise<LivePointsResponse> => {
  const response = await fetch(`${BACKEND_URL}/api/live-points`);
  const json: ApiResponse = await response.json();
  if (!json.success) {
    throw new Error('Failed to fetch live points');
  }
  return json.data;
};

// eslint-disable-next-line import/prefer-default-export
export function useLivePoints(): UseQueryResult<LivePointsResponse, Error> {
  return useQuery<LivePointsResponse, Error>({
    queryKey: ['livePoints'],
    queryFn: fetchLivePoints,
    staleTime: REFETCH_INTERVAL_MS,
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
