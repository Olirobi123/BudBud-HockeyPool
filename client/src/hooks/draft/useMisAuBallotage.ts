import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { MisAuBallotage } from '@/types/IMisAuBallotage';
import { BACKEND_URL } from '@/lib/apiConfig';

const fetchMisAuBallotage = async (type: number, annee: number): Promise<MisAuBallotage[]> => {
  const response = await fetch(`${BACKEND_URL}/api/mis-au-ballotage/${type}/${annee}`);
  if (response.status === 404) return [];
  if (response.ok === false) {
    throw new Error('Erreur lors de la récupération des mises au ballotage');
  }
  const result: { data?: MisAuBallotage[] } = await response.json() as { data?: MisAuBallotage[] };
  return result.data ?? [];
};

export function useMisAuBallotage(type: number, annee: number): UseQueryResult<MisAuBallotage[]> {
  return useQuery<MisAuBallotage[]>({
    queryKey: ['misAuBallotage', type, annee],
    queryFn: () => fetchMisAuBallotage(type, annee),
    enabled: type > 0 && annee > 0,
  });
}
