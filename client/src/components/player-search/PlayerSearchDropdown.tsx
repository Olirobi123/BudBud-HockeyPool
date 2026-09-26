import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NHLPlayer } from '@/types/IPlayerDetails';
import { PLAYER_SEARCH_MIN_LENGTH } from '@/hooks/player-search/usePlayerSearch';
import { PlayerSearchResultItem } from './PlayerSearchResultItem';

interface PlayerSearchDropdownProps {
  isOpen: boolean;
  search: string;
  players?: NHLPlayer[];
  isLoading: boolean;
  error: unknown;
  onSelect: (player: NHLPlayer) => void;
}

export const PlayerSearchDropdown: React.FC<PlayerSearchDropdownProps> = ({
  isOpen,
  search,
  players,
  isLoading,
  error,
  onSelect,
}) => {
  if (!isOpen || search.trim().length < PLAYER_SEARCH_MIN_LENGTH) return null;
  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto bg-card border shadow-lg">
      <CardContent className="p-0">
        {error ? (
          <div className="p-4 text-center text-destructive">
            Erreur lors de la recherche. Vérifiez votre connexion.
          </div>
        ) : players?.length ? (
          <div className="divide-y divide-border">
            {players.map((player) => (
              <PlayerSearchResultItem key={player.playerId} player={player} onClick={() => onSelect(player)} />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            {`Aucun joueur trouvé pour "${search}"`}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
