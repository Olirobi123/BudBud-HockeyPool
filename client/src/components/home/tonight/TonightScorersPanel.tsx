import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import type { LivePlayerPoints } from '@/types/ILivePoints';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Stat line for a player. Goalies earn on wins and shutouts rather than
 * goals and assists, so they read differently.
 */
function statLine(player: LivePlayerPoints): string {
  if (player.position === 'G') {
    const parts: string[] = [];
    if ((player.wins ?? 0) > 0) parts.push(`${player.wins} V`);
    if ((player.shutouts ?? 0) > 0) parts.push(`${player.shutouts} BL`);
    return parts.length > 0 ? parts.join(' · ') : '—';
  }
  return `${player.goals} B · ${player.assists} A`;
}

interface TonightScorersPanelProps {
  players: LivePlayerPoints[];
  // eslint-disable-next-line react/require-default-props
  limit?: number;
}

// eslint-disable-next-line import/prefer-default-export
export function TonightScorersPanel({
  players, limit = 5,
}: TonightScorersPanelProps): JSX.Element {
  const top = players.slice(0, limit);

  if (top.length === 0) {
    return <EmptyState icon={Target} message="Aucun point marqué ce soir" />;
  }

  return (
    <ol className="divide-y divide-border">
      {top.map((player, index) => (
        <li key={player.nhlPlayerId}>
          <Link
            to={`/joueur/${player.nhlPlayerId}`}
            className="flex items-center gap-3 py-2 transition-colors hover:bg-muted/60"
          >
            <span className="w-4 flex-shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
              {index + 1}
            </span>

            <div className="relative flex-shrink-0">
              <img
                src={player.headshot}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-8 w-8 rounded-full bg-muted object-cover"
              />
              <img
                src={player.nhlTeamLogo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute -bottom-0.5 -right-1 h-4 w-4 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight text-foreground">
                {player.firstName}
                {' '}
                {player.lastName}
              </p>
              <p className="truncate text-xs leading-tight text-muted-foreground">
                {player.poolTeam?.nom ?? 'Libre'}
              </p>
            </div>

            <span className="flex-shrink-0 text-xs tabular-nums text-muted-foreground">
              {statLine(player)}
            </span>
            <span className="w-6 flex-shrink-0 text-right text-sm font-bold tabular-nums text-foreground">
              {player.points}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
