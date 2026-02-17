import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';
import type { LivePointsResponse } from '@/types/ILivePoints';

interface ApiResponse {
  success: boolean;
  data: LivePointsResponse;
}

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
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
