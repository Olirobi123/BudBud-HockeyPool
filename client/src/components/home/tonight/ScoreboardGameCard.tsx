import { JSX } from 'react';
import { GameScore } from '@/types';
import { cn } from '@/lib/utils';
import {
  formatGameState,
  getGameCenterUrl,
  getGameStatus,
  getWinners,
  isCritical,
  type GameStatus,
} from '@/components/scores/gameState';
import { TeamLogo } from '@/components/ui/team-logo';

interface TeamLineProps {
  team: GameScore['awayTeam'] | GameScore['homeTeam'];
  isWinner: boolean;
  status: GameStatus;
}

function TeamLine({ team, isWinner, status }: TeamLineProps): JSX.Element {
  // A finished game dims the loser; live and upcoming games stay neutral,
  // because a lead in progress is not a result.
  const dimmed = status === 'final' && !isWinner;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <TeamLogo
          src={team.logo}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={cn(
            'h-7 w-7 flex-shrink-0 object-contain transition-opacity',
            dimmed && 'opacity-40',
          )}
        />
        <span
          className={cn(
            'font-display text-sm font-semibold tracking-wide',
            dimmed ? 'text-muted-foreground' : 'text-foreground',
            status === 'upcoming' && 'text-muted-foreground',
          )}
        >
          {team.abbrev}
        </span>
      </div>
      <span
        className={cn(
          'text-lg font-bold tabular-nums leading-none',
          dimmed ? 'text-muted-foreground' : 'text-foreground',
          status === 'upcoming' && 'text-muted-foreground/50',
        )}
      >
        {team.score ?? '–'}
      </span>
    </div>
  );
}

interface ScoreboardGameCardProps {
  game: GameScore;
}

/**
 * One game on the home scoreboard.
 *
 * Presentational only — all state interpretation comes from
 * `components/scores/gameState`. Red appears here and nowhere else on the
 * page, and means exactly one thing: this game is happening right now.
 */
// eslint-disable-next-line import/prefer-default-export
export function ScoreboardGameCard({ game }: ScoreboardGameCardProps): JSX.Element {
  const status = getGameStatus(game.gameState);
  const critical = isCritical(game);
  const { awayWins, homeWins } = getWinners(game);
  const href = getGameCenterUrl(game);
  const stateText = formatGameState(game);

  const content = (
    <>
      <div className="mb-3 flex items-center gap-1.5">
        {status === 'live' && (
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
          </span>
        )}
        <span
          className={cn(
            'font-display text-[11px] font-bold uppercase tracking-wider tabular-nums',
            status === 'live' ? 'text-live' : 'text-muted-foreground',
          )}
        >
          {stateText}
        </span>
      </div>

      <div className="space-y-2">
        <TeamLine team={game.awayTeam} isWinner={awayWins} status={status} />
        <TeamLine team={game.homeTeam} isWinner={homeWins} status={status} />
      </div>
    </>
  );

  const className = cn(
    'block rounded-lg border bg-card p-3 transition-colors',
    status === 'live' && 'border-live/40',
    // Overtime escalates the same red rather than introducing a second hue.
    critical && 'border-live ring-1 ring-live/20',
    status !== 'live' && 'border-border',
    href !== undefined && 'hover:border-foreground/25',
  );

  if (href === undefined) {
    return <div className={className}>{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={`${game.awayTeam.abbrev} contre ${game.homeTeam.abbrev} — ${stateText}`}
    >
      {content}
    </a>
  );
}
