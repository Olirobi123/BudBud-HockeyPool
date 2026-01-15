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
  return `Prol.${period > 3 ? period - 3 : ''}`;
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

  // Future game - show start time in ET
  const date = new Date(startTimeUTC);
  return date.toLocaleTimeString('fr-CA', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });
}

/**
 * Check if game is currently live
 */
function isLive(gameState: string): boolean {
  return gameState === 'LIVE' || gameState === 'CRIT';
}

interface GameCardProps {
  game: GameScore;
}

function GameCard({ game }: GameCardProps): JSX.Element {
  const { awayTeam, homeTeam, gameState } = game;
  const live = isLive(gameState);
  const stateText = formatGameState(game);

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-slate-800/50 border border-slate-700/50',
        'flex-shrink-0',
        live && 'border-red-500/50 bg-slate-800/70',
      )}
    >
      {/* Away Team */}
      <div className="flex items-center gap-1">
        <img
          src={awayTeam.logo}
          alt={awayTeam.abbrev}
          className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 object-contain"
        />
        <span className="text-[10px] sm:text-xs font-medium text-slate-200 whitespace-nowrap">{awayTeam.abbrev}</span>
        <span className="text-[10px] sm:text-xs font-bold text-white">{awayTeam.score ?? '-'}</span>
      </div>

      {/* Separator / Game State */}
      <div className="flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-[8px] sm:text-[10px] text-slate-400">@</span>
        <div className="flex items-center gap-1.5">
          {live && (
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500" />
            </span>
          )}
          <span className={cn(
            'text-[8px] sm:text-[10px] font-medium whitespace-nowrap',
            live ? 'text-red-400' : 'text-slate-400',
          )}
          >
            {stateText}
          </span>
        </div>
      </div>

      {/* Home Team */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] sm:text-xs font-bold text-white">{homeTeam.score ?? '-'}</span>
        <span className="text-[10px] sm:text-xs font-medium text-slate-200 whitespace-nowrap">{homeTeam.abbrev}</span>
        <img
          src={homeTeam.logo}
          alt={homeTeam.abbrev}
          className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 object-contain"
        />
      </div>
    </div>
  );
}

export default function LiveScoresTicker(): JSX.Element | null {
  const { data: games, isLoading, error } = useNHLScores();

  // Don't render anything if loading, error, or no games
  if (isLoading || error !== null || games === undefined || games.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            LNH
          </span>
          <div className="flex items-center gap-2">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
