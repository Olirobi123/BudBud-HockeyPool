import { JSX } from 'react';
import useNHLScores from '@/hooks/useNHLScores';
import { GameScore } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Get period label for display
 */
function getPeriodLabel(period: number | undefined): string {
  if (period === undefined) return '';
  if (period === 1) return '1re';
  if (period === 2) return '2e';
  if (period === 3) return '3e';
  return 'Prol.';
}

/**
 * Format game state for display
 */
function formatGameState(game: GameScore): string {
  const {
    gameState, period, clock, startTimeUTC,
  } = game;

  if (gameState === 'LIVE' || gameState === 'CRIT') {
    const periodLabel = getPeriodLabel(period);
    const isIntermission = clock?.inIntermission === true;
    const timeRemaining = clock?.timeRemaining ?? '';
    return isIntermission ? `Entr. ${periodLabel}` : `${periodLabel} ${timeRemaining}`;
  }

  if (gameState === 'FINAL' || gameState === 'OFF') {
    const periodType = game.periodDescriptor?.periodType;
    if (periodType === 'OT') return 'F/Prol.';
    if (periodType === 'SO') return 'F/TB';
    return 'FINAL';
  }

  // Future game — show start time in ET
  const date = new Date(startTimeUTC);
  return date.toLocaleTimeString('fr-CA', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });
}

type GameStatus = 'live' | 'final' | 'upcoming';

function getGameStatus(gameState: string): GameStatus {
  if (gameState === 'LIVE' || gameState === 'CRIT') return 'live';
  if (gameState === 'FINAL' || gameState === 'OFF') return 'final';
  return 'upcoming';
}

interface TeamRowProps {
  team: GameScore['awayTeam'] | GameScore['homeTeam'];
  isWinner: boolean;
  status: GameStatus;
}

function TeamRow({ team, isWinner, status }: TeamRowProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <img
          src={team.logo}
          alt={team.abbrev}
          className="w-5 h-5 flex-shrink-0 object-contain"
        />
        <span
          className={cn(
            'text-xs font-semibold tracking-wide whitespace-nowrap font-display',
            status === 'final' && !isWinner && 'text-slate-500',
            status === 'final' && isWinner && 'text-white',
            status === 'live' && 'text-slate-200',
            status === 'upcoming' && 'text-slate-400',
          )}
        >
          {team.abbrev}
        </span>
      </div>
      <span
        className={cn(
          'text-sm font-bold tabular-nums min-w-[1ch] text-right',
          status === 'final' && !isWinner && 'text-slate-500',
          status === 'final' && isWinner && 'text-white',
          status === 'live' && 'text-white',
          status === 'upcoming' && 'text-slate-500',
        )}
      >
        {team.score ?? '-'}
      </span>
    </div>
  );
}

interface GameCardProps {
  game: GameScore;
}

function GameCard({ game }: GameCardProps): JSX.Element {
  const { awayTeam, homeTeam, gameState } = game;
  const status = getGameStatus(gameState);
  const stateText = formatGameState(game);
  const isCritical = gameState === 'CRIT';

  const awayWins = status === 'final' && (awayTeam.score ?? 0) > (homeTeam.score ?? 0);
  const homeWins = status === 'final' && (homeTeam.score ?? 0) > (awayTeam.score ?? 0);

  return (
    <div
      className={cn(
        'flex-shrink-0 rounded-lg border flex flex-col px-3 py-2.5 min-w-[100px] w-[100px]',
        'transition-all duration-200 cursor-default group',
        // Live games
        status === 'live' && 'bg-white/[0.04] border-red-500/30 game-card-live hover:border-red-500/50',
        // Critical (OT) — extra emphasis
        isCritical && 'bg-red-500/[0.06] border-red-400/40',
        // Final games
        status === 'final' && 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]',
        // Upcoming
        status === 'upcoming' && 'bg-white/[0.015] border-white/[0.04] hover:border-white/[0.08]',
      )}
    >
      {/* Game State Header */}
      <div className="flex items-center justify-center gap-1.5 mb-2">
        {status === 'live' && (
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
            <span className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              isCritical ? 'bg-amber-400' : 'bg-red-400',
            )}
            />
            <span className={cn(
              'relative inline-flex rounded-full h-1.5 w-1.5',
              isCritical ? 'bg-amber-400' : 'bg-red-500',
            )}
            />
          </span>
        )}
        <span className={cn(
          'text-[10px] font-bold tracking-wider uppercase whitespace-nowrap font-display',
          status === 'live' && !isCritical && 'text-red-400',
          isCritical && 'text-amber-400',
          status === 'final' && 'text-slate-500',
          status === 'upcoming' && 'text-cyan-500/70',
        )}
        >
          {stateText}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-1">
        <TeamRow team={awayTeam} isWinner={awayWins} status={status} />
        <TeamRow team={homeTeam} isWinner={homeWins} status={status} />
      </div>
    </div>
  );
}

/**
 * pill at the start of the ticker
 */
function TickerLabel(): JSX.Element {
  return (
    <div className="flex-shrink-0 flex items-center gap-2 pr-3 mr-1 ">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
    </div>
  );
}

export default function LiveScoresTicker(): JSX.Element | null {
  const { data: games, isLoading, error } = useNHLScores();

  // Don't render anything if loading, error, or no games
  if (isLoading || error !== null || games === undefined || games.length === 0) {
    return null;
  }

  // Sort: live first, then upcoming, then final
  const sorted = [...games].sort((a, b) => {
    const order: Record<string, number> = {
      CRIT: 0, LIVE: 1, FUT: 2, PRE: 2, FINAL: 3, OFF: 3,
    };
    return (order[a.gameState] ?? 4) - (order[b.gameState] ?? 4);
  });

  return (
    <div className="w-full ticker-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide">
          <TickerLabel />
          <div className="flex items-center gap-2">
            {sorted.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
