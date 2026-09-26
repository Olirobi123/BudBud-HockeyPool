import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '@/lib/apiConfig';

async function send(method: 'POST' | 'PUT' | 'DELETE', path: string, body?: object): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/draft-day${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(result?.error ?? `Erreur ${response.status}`);
  }
}

/** Écritures de la régie ; chaque succès rafraîchit le tableau et les listes de la home. */
// eslint-disable-next-line import/prefer-default-export
export function useDraftRegieMutations() {
  const queryClient = useQueryClient();
  const onSuccess = () => queryClient.invalidateQueries({ queryKey: ['draft-day'] });

  const setEquipe = useMutation({
    mutationFn: ({ rang, equipeId }: { rang: number; equipeId: number }) => send('PUT', `/picks/${rang}/equipe`, { equipeId }),
    onSuccess,
  });

  const setJoueur = useMutation({
    mutationFn: ({ rang, nhlPlayerId }: { rang: number; nhlPlayerId: number }) => send('PUT', `/picks/${rang}/joueur`, { nhlPlayerId }),
    onSuccess,
  });

  const clearJoueur = useMutation({
    mutationFn: ({ rang }: { rang: number }) => send('DELETE', `/picks/${rang}/joueur`),
    onSuccess,
  });

  const addPick = useMutation({
    mutationFn: ({ equipeId }: { equipeId: number }) => send('POST', '/picks', { equipeId }),
    onSuccess,
  });

  const removePick = useMutation({
    mutationFn: ({ rang }: { rang: number }) => send('DELETE', `/picks/${rang}`),
    onSuccess,
  });

  return {
    setEquipe, setJoueur, clearJoueur, addPick, removePick,
  };
}
