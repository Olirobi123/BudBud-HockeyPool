import { useMutation, useQueryClient } from '@tanstack/react-query';
import Echange from '@/types/IEchange';
import { BACKEND_URL } from '@/lib/apiConfig';

interface CreateEchangeData {
  equipe_source_id: string;
  equipe_destination_id: string;
  details: string;
}

const createEchange = async (data: CreateEchangeData): Promise<Echange> => {
  const response = await fetch(`${BACKEND_URL}/api/echanges`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de l\'échange');
  }

  const result = await response.json();
  return result.data;
};

export function useCreateEchange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEchange,
    onSuccess: () => {
      // Invalider le cache des échanges pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['echanges'] });
    },
  });
}
