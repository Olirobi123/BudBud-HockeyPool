import { JSX, useMemo } from 'react';
import { DYNAMIC_ROUND } from '@/lib/draftDay';
import type { DraftBoardPick } from '@/types/IDraftDay';
import { DraftBoardRound } from './DraftBoardRound';

interface DraftBoardProps {
  picks: DraftBoardPick[];
}

// eslint-disable-next-line import/prefer-default-export
export function DraftBoard({ picks }: DraftBoardProps): JSX.Element {
  const rounds = useMemo(() => {
    // La ronde dynamique reste visible même sans choix : on en ajoute pendant la soirée.
    const roundNumbers = [...picks.map((p) => p.round), DYNAMIC_ROUND]
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
