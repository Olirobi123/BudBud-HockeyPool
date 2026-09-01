import { GameScore } from '@/types';

/**
 * Pure helpers for interpreting NHL game state.
 *
 * These live outside any component so the ticker (`LiveScoresTicker`) and the
 * home scoreboard (`components/home/tonight/`) share one interpretation of
 * `gameState`, `period` and `clock` rather than each rolling their own.
 */

export type GameStatus = 'live' | 'final' | 'upcoming';

/** Display order: games in overtime first, then live, then upcoming, then done. */
const STATE_PRIORITY: Record<string, number> = {
  CRIT: 0,
  LIVE: 1,
  FUT: 2,
  PRE: 2,
  FINAL: 3,
  OFF: 3,
};

/** Coarse status used to pick a visual treatment. */
export function getGameStatus(gameState: string): GameStatus {
  if (gameState === 'LIVE' || gameState === 'CRIT') return 'live';
  if (gameState === 'FINAL' || gameState === 'OFF') return 'final';
  return 'upcoming';
}

/** `CRIT` means the game is in overtime or the final minutes — the loudest state. */
export function isCritical(game: GameScore): boolean {
  return game.gameState === 'CRIT';
}

/** French ordinal for a period number. Anything past 3 is overtime. */
export function getPeriodLabel(period: number | undefined): string {
  if (period === undefined) return '';
  if (period === 1) return '1re';
  if (period === 2) return '2e';
  if (period === 3) return '3e';
  return 'Prol.';
}

/**
 * Short French status line for a game — the text under/next to the score.
 * Live: `2e 14:32` or `Entr. 2e`. Done: `FINAL` / `F/Prol.` / `F/TB`.
 * Upcoming: the local start time in Eastern.
 */
export function formatGameState(game: GameScore): string {
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

  const date = new Date(startTimeUTC);
  return date.toLocaleTimeString('fr-CA', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });
}

export interface GameWinners {
  awayWins: boolean;
  homeWins: boolean;
}

/**
 * Which side won. Only meaningful once the game is final — an in-progress
 * lead is not a win, so both flags stay false until then.
 */
export function getWinners(game: GameScore): GameWinners {
  if (getGameStatus(game.gameState) !== 'final') {
    return { awayWins: false, homeWins: false };
  }
  const away = game.awayTeam.score ?? 0;
  const home = game.homeTeam.score ?? 0;
  return { awayWins: away > home, homeWins: home > away };
}

/** Sort a copy of `games` into display order. Does not mutate the input. */
export function sortGamesByPriority(games: GameScore[]): GameScore[] {
  return [...games].sort(
    (a, b) => (STATE_PRIORITY[a.gameState] ?? 4) - (STATE_PRIORITY[b.gameState] ?? 4),
  );
}

/** True when at least one game is in progress — drives polling cadence and the live badge. */
export function hasLiveGame(games: GameScore[] | undefined): boolean {
  return games?.some((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT') ?? false;
}

/** Full NHL game-centre URL, or undefined when the API omitted the link. */
export function getGameCenterUrl(game: GameScore): string | undefined {
  const link = game.gameCenterLink;
  if (link === undefined || link === '') return undefined;
  return `https://www.nhl.com${link}`;
}
