import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { NHLPlayer } from '@/types/IPlayerDetails';
import { BACKEND_URL } from '@/lib/apiConfig';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

// Même rythme que la régie : 3 lettres et une pause de frappe avant d'interroger la LNH.
export const PLAYER_SEARCH_MIN_LENGTH = 3;

async function searchPlayers(query: string): Promise<NHLPlayer[]> {
  if (query.length < PLAYER_SEARCH_MIN_LENGTH) return [];
  const response = await fetch(`${BACKEND_URL}/api/players/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur de recherche');
  const result = await response.json();
  return result.data ?? [];
}

export function usePlayerSearch(onPlayerSelect?: (player: NHLPlayer) => void) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const debounced = useDebouncedValue(search.trim());
  const isWaiting = search.trim() !== debounced;

  const { data: players, isFetching, error } = useQuery<NHLPlayer[]>({
    queryKey: ['players', debounced],
    queryFn: () => searchPlayers(debounced),
    enabled: debounced.length >= PLAYER_SEARCH_MIN_LENGTH,
    staleTime: 5 * 60 * 1000,
  });
  // En attente de la pause de frappe ou de la réponse : pas de « Aucun joueur trouvé » prématuré.
  const isLoading = isWaiting || isFetching;

  const handleSelect = (player: NHLPlayer) => {
    setIsOpen(false);
    setSearch('');
    if (onPlayerSelect) {
      onPlayerSelect(player);
    } else {
      navigate(`/joueur/${player.playerId}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    setIsOpen(value.trim().length >= PLAYER_SEARCH_MIN_LENGTH);
  };

  return {
    ref,
    search,
    setSearch,
    isOpen,
    setIsOpen,
    players,
    isLoading,
    error,
    handleSelect,
    handleInputChange,
  };
}
