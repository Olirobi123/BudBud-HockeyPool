import {
  JSX, useRef, useCallback, useState, useEffect,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useNHLScores from '@/hooks/useNHLScores';
import { GameScore } from '@/types';
import { cn } from '@/lib/utils';
import {
  formatGameState,
  getGameCenterUrl,
  getGameStatus,
  getWinners,
  isCritical,
  sortGamesByPriority,
  type GameStatus,
} from '@/components/scores/gameState';

interface TeamRowProps {
  team: GameScore['awayTeam'] | GameScore['homeTeam'];
  isWinner: boolean;
  status: GameStatus;
}

function TeamRow({ team, isWinner, status }: TeamRowProps): JSX.Element {
  const dimmed = (status === 'final' && !isWinner) || status === 'upcoming';

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <img
          src={team.logo}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={cn('h-[26px] w-[26px] flex-shrink-0 object-contain', dimmed && 'opacity-45')}
        />
        <span
          className={cn(
            'whitespace-nowrap font-display text-xs font-semibold tracking-wide',
            dimmed ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {team.abbrev}
        </span>
      </div>
      <span
        className={cn(
          'min-w-[1ch] text-right text-sm font-bold tabular-nums',
          dimmed ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {team.score ?? '–'}
      </span>
    </div>
  );
}

function GameCard({ game }: { game: GameScore }): JSX.Element {
  const status = getGameStatus(game.gameState);
  const critical = isCritical(game);
  const { awayWins, homeWins } = getWinners(game);
  const href = getGameCenterUrl(game);
  const stateText = formatGameState(game);

  const cardClass = cn(
    'flex w-[104px] min-w-[104px] flex-shrink-0 flex-col rounded-lg border bg-card px-2 py-1.5',
    'transition-colors duration-200',
    status === 'live' ? 'border-live/40' : 'border-border',
    critical && 'border-live ring-1 ring-live/20',
    href !== undefined ? 'cursor-pointer hover:border-foreground/25' : 'cursor-default',
  );

  const content = (
    <>
      <div className="mb-2 flex items-center justify-center gap-1.5">
        {status === 'live' && (
          <span className="relative flex h-1.5 w-1.5 flex-shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
          </span>
        )}
        <span
          className={cn(
            'whitespace-nowrap font-display text-[10px] font-bold uppercase tracking-wider tabular-nums',
            status === 'live' ? 'text-live' : 'text-muted-foreground',
          )}
        >
          {stateText}
        </span>
      </div>

      <div className="space-y-1">
        <TeamRow team={game.awayTeam} isWinner={awayWins} status={status} />
        <TeamRow team={game.homeTeam} isWinner={homeWins} status={status} />
      </div>
    </>
  );

  if (href === undefined) {
    return <div className={cardClass}>{content}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
      aria-label={`${game.awayTeam.abbrev} contre ${game.homeTeam.abbrev} — ${stateText}`}
    >
      {content}
    </a>
  );
}

export default function LiveScoresTicker(): JSX.Element | null {
  const { data: games, isLoading, error } = useNHLScores();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [games]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -320 : 320, behavior: 'smooth' });
  }, []);

  if (isLoading || error !== null || games === undefined || games.length === 0) {
    return null;
  }

  return (
    <div className="w-full border-b border-border bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1">
          {hasOverflow && (
            <button
              type="button"
              onClick={() => scroll('left')}
              className="hidden h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
              aria-label="Défiler à gauche"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto py-2"
          >
            {sortGamesByPriority(games).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          {hasOverflow && (
            <button
              type="button"
              onClick={() => scroll('right')}
              className="hidden h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
              aria-label="Défiler à droite"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
