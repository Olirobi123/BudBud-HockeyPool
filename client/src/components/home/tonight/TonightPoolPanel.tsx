import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import type { LiveTeamPoints } from '@/types/ILivePoints';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

/** A team appears on the board once it has actually banked a point tonight. */
export function hasScoredTonight(team: LiveTeamPoints): boolean {
  return team.totalPoints > 0;
}

interface TonightPoolPanelProps {
  teams: LiveTeamPoints[];
  /** How many rows to show before deferring to the full leaderboard below. */
  // eslint-disable-next-line react/require-default-props
  limit?: number;
}

/**
 * Pool teams gaining points tonight. Teams that have not scored are filtered
 * out — a wall of zeroes is noise, and the full standings sit further down
 * the page for anyone who wants them.
 */
export function TonightPoolPanel({ teams, limit = 5 }: TonightPoolPanelProps): JSX.Element {
  const scoring = teams.filter(hasScoredTonight).slice(0, limit);

  if (scoring.length === 0) {
    return <EmptyState icon={Users} message="Aucune équipe n'a marqué ce soir" />;
  }

  return (
    <ol className="divide-y divide-border">
      {scoring.map((team, index) => (
        <li key={team.equipeId}>
          <Link
            to={`/equipes/${team.equipeId}`}
            className="flex items-center gap-3 py-2 transition-colors hover:bg-muted/60"
          >
            <span className="w-4 flex-shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {team.equipeNom}
            </span>
            <span className="flex-shrink-0 text-xs tabular-nums text-muted-foreground">
              {team.totalPJ}
              {' '}
              PJ
            </span>
            <span
              className={cn(
                'w-10 flex-shrink-0 text-right text-sm font-bold tabular-nums',
                'text-positive',
              )}
            >
              +
              {team.totalPoints}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
