import { JSX } from 'react';
import { CalendarOff } from 'lucide-react';
import { GameScore } from '@/types';
import { EmptyState } from '@/components/ui/empty-state';
import { sortGamesByPriority } from '@/components/scores/gameState';
import { ScoreboardGameCard } from './ScoreboardGameCard';

interface ScoreboardRailProps {
  games: GameScore[];
}

/**
 * Layout for tonight's games. Live games sort first so the red cards land
 * at the top-left, where the eye starts.
 */
// eslint-disable-next-line import/prefer-default-export
export function ScoreboardRail({ games }: ScoreboardRailProps): JSX.Element {
  if (games.length === 0) {
    return (
      <EmptyState
        icon={CalendarOff}
        message="Aucun match ce soir"
        hint="Les scores apparaîtront ici dès la reprise du calendrier."
      />
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {sortGamesByPriority(games).map((game) => (
        <li key={game.id}>
          <ScoreboardGameCard game={game} />
        </li>
      ))}
    </ul>
  );
}
