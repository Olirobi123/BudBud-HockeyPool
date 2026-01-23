import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { NHLPlayer } from '@/types/IPlayerDetails';

async function searchPlayers(query: string): Promise<NHLPlayer[]> {
  if (!query || query.length < 2) return [];
  const response = await fetch(`/api/players/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur de recherche');
  const result = await response.json();
  return result.data ?? [];
}

export function usePlayerSearch(onPlayerSelect?: (player: NHLPlayer) => void) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const { data: players, isLoading, error } = useQuery<NHLPlayer[]>({
    queryKey: ['players', search],
    queryFn: () => searchPlayers(search),
    enabled: search.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const handleSelect = (player: NHLPlayer) => {
    setIsOpen(false);
    setSearch('');
    if (onPlayerSelect) {
      onPlayerSelect(player);
    } else {
      setLocation(`/joueur/${player.playerId}`);
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
    setIsOpen(value.length >= 2);
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
