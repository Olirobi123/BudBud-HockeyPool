import { JSX } from 'react';
import { Card } from '@/components/ui/card';
import type { DraftBoardPick as DraftBoardPickData } from '@/types/IDraftDay';
import { DraftBoardPick } from './DraftBoardPick';

interface DraftBoardRoundProps {
  round: number;
  picks: DraftBoardPickData[];
  onTheClockRang: number | null;
}

// eslint-disable-next-line import/prefer-default-export
export function DraftBoardRound({ round, picks, onTheClockRang }: DraftBoardRoundProps): JSX.Element {
  const made = picks.filter((p) => p.joueur !== null).length;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-baseline justify-between border-b border-border px-3 py-2.5">
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
          Ronde
          {' '}
          {round}
        </h3>
        <span className="text-xs tabular-nums text-muted-foreground">
          {made}
          {' / '}
          {picks.length}
        </span>
      </div>
      {picks.length === 0 ? (
        <p className="px-3 py-4 text-sm text-muted-foreground">Aucun choix pour l&apos;instant</p>
      ) : (
        <ol className="divide-y divide-border/60">
          {picks.map((pick) => (
            <DraftBoardPick key={pick.rang} pick={pick} isOnTheClock={pick.rang === onTheClockRang} />
          ))}
        </ol>
      )}
    </Card>
  );
}
