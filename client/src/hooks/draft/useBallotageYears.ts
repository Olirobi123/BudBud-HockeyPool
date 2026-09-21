import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { MisAuBallotage } from '@/types/IMisAuBallotage';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchBallotageYears = async (): Promise<number[]> => {
  const response = await fetch(`${BACKEND_URL}/api/mis-au-ballotage`);
  if (response.ok === false) {
    throw new Error('Erreur lors de la récupération des mises au ballotage');
  }
  const result: { data?: MisAuBallotage[] } = await response.json() as { data?: MisAuBallotage[] };
  return Array.from(new Set((result.data ?? []).map((entry) => entry.annee)));
};

// Years with at least one mise au ballotage — a draft year exists here
// before any pick has been made in it.
export function useBallotageYears(): UseQueryResult<number[]> {
  return useQuery<number[]>({
    queryKey: ['ballotageYears'],
    queryFn: fetchBallotageYears,
  });
}
