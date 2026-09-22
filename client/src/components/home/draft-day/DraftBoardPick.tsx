import { JSX } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { DraftBoardPick as DraftBoardPickData } from '@/types/IDraftDay';

interface DraftBoardPickProps {
  pick: DraftBoardPickData;
  /** Premier choix encore vide : l'équipe est « au choix ». */
  isOnTheClock: boolean;
}

function OnTheClock(): JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-live">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
      </span>
      Au choix
    </span>
  );
}

function PickedPlayer({ pick }: { pick: DraftBoardPickData }): JSX.Element {
  const name = pick.joueurNhlId !== null ? (
    <Link to={`/joueur/${pick.joueurNhlId}`} className="truncate hover:underline">
      {pick.joueur}
    </Link>
  ) : (
    <span className="truncate">{pick.joueur}</span>
  );

  return (
    <span className="flex min-w-0 items-baseline justify-end gap-1.5 text-sm font-semibold text-foreground">
      {name}
      {pick.joueurPosition !== null && (
        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{pick.joueurPosition}</span>
      )}
    </span>
  );
}

// eslint-disable-next-line import/prefer-default-export
export function DraftBoardPick({ pick, isOnTheClock }: DraftBoardPickProps): JSX.Element {
  const renderRight = (): JSX.Element => {
    if (pick.joueur !== null) return <PickedPlayer pick={pick} />;
    if (isOnTheClock) return <OnTheClock />;
    return <span className="text-sm text-muted-foreground/50">—</span>;
  };

  return (
    <li
      className={cn(
        'grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.25fr)] items-center gap-3 border-l-2 px-3 py-2',
        isOnTheClock ? 'border-l-live bg-muted/40' : 'border-l-transparent',
      )}
      aria-current={isOnTheClock ? 'step' : undefined}
    >
      <span className="font-display text-sm tabular-nums text-muted-foreground">{pick.rang}</span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          {pick.equipeNomCourt ?? pick.equipeNom}
        </span>
        {pick.sourceNom !== null && (
          <span className="block truncate text-[11px] text-muted-foreground">
            via
            {' '}
            {pick.sourceNomCourt ?? pick.sourceNom}
          </span>
        )}
      </span>
      <span className="flex min-w-0 justify-end text-right">{renderRight()}</span>
    </li>
  );
}
