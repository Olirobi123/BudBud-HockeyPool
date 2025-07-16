import { usePlayerSearch } from '@/hooks/player-search/usePlayerSearch';
import { PlayerSearchInput } from './player-search/PlayerSearchInput';
import { PlayerSearchDropdown } from './player-search/PlayerSearchDropdown';

interface PlayerSearchProps {
  onPlayerSelect?: (player: import('@/types/IPlayerDetails').NHLPlayer) => void;
  placeholder?: string;
  className?: string;
}

export default function PlayerSearch({
  onPlayerSelect,
  placeholder = 'Rechercher un joueur...',
  className = '',
}: PlayerSearchProps) {
  const {
    ref,
    search,
    isOpen,
    players,
    isLoading,
    error,
    handleSelect,
    handleInputChange,
  } = usePlayerSearch(onPlayerSelect);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <PlayerSearchInput
        value={search}
        onChange={handleInputChange}
        onFocus={() => search.length >= 2 && isOpen === false}
        isLoading={isLoading}
        placeholder={placeholder}
      />
      <PlayerSearchDropdown
        isOpen={isOpen}
        search={search}
        players={players}
        isLoading={isLoading}
        error={error}
        onSelect={handleSelect}
      />
    </div>
  );
}
