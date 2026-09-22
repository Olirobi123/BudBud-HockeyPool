import { JSX, useMemo } from 'react';
import type { DraftBoardPick } from '@/types/IDraftDay';
import { DraftBoardRound } from './DraftBoardRound';

interface DraftBoardProps {
  picks: DraftBoardPick[];
}

// eslint-disable-next-line import/prefer-default-export
export function DraftBoard({ picks }: DraftBoardProps): JSX.Element {
  const rounds = useMemo(() => {
    const roundNumbers = picks
      .map((p) => p.round)
      .filter((round, i, all) => all.indexOf(round) === i)
      .sort((a, b) => a - b);
    return roundNumbers.map((round) => [round, picks.filter((p) => p.round === round)] as const);
  }, [picks]);

  const onTheClockRang = picks.find((p) => p.joueur === null)?.rang ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {rounds.map(([round, roundPicks]) => (
        <DraftBoardRound key={round} round={round} picks={roundPicks} onTheClockRang={onTheClockRang} />
      ))}
    </div>
  );
}
