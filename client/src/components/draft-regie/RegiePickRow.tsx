import { JSX } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type Equipe from '@/types/IEquipes';
import type { DraftBoardPick, DraftProspectSearchResult } from '@/types/IDraftDay';
import { RegiePlayerPicker } from './RegiePlayerPicker';
import { RegieTeamSelect } from './RegieTeamSelect';

interface RegiePickRowProps {
  pick: DraftBoardPick;
  equipes: Equipe[];
  isOnTheClock: boolean;
  isBusy: boolean;
  onTeamChange: (equipeId: number) => void;
  onPlayerPick: (player: DraftProspectSearchResult) => void;
  onClear: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export function RegiePickRow({
  pick, equipes, isOnTheClock, isBusy, onTeamChange, onPlayerPick, onClear,
}: RegiePickRowProps): JSX.Element {
  return (
    <li
      className={cn(
        'grid grid-cols-1 gap-2 border-l-2 px-3 py-3 sm:grid-cols-[3rem_17rem_minmax(0,1fr)] sm:items-center',
        isOnTheClock ? 'border-l-live bg-muted/40' : 'border-l-transparent',
        isBusy && 'opacity-60',
      )}
    >
      <span className="font-display text-sm tabular-nums text-muted-foreground">
        {`#${pick.rang}`}
        <span className="ml-1 text-[11px] sm:hidden">{pick.sourceNomCourt !== null && `(via ${pick.sourceNomCourt})`}</span>
      </span>
      <div className="min-w-0">
        <RegieTeamSelect
          equipes={equipes}
          value={pick.equipeId}
          onChange={onTeamChange}
          disabled={isBusy}
          rang={pick.rang}
        />
        {pick.sourceNomCourt !== null && (
          <span className="mt-0.5 hidden text-[11px] text-muted-foreground sm:block">{`via ${pick.sourceNomCourt}`}</span>
        )}
      </div>
      {pick.joueur !== null ? (
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {pick.joueur}
            {pick.joueurPosition !== null && (
              <span className="ml-1.5 text-xs font-medium text-muted-foreground">{pick.joueurPosition}</span>
            )}
          </span>
          <Button variant="ghost" size="sm" onClick={onClear} disabled={isBusy} aria-label={`Retirer ${pick.joueur} du choix #${pick.rang}`}>
            <X className="mr-1 h-4 w-4" />
            Retirer
          </Button>
        </div>
      ) : (
        <RegiePlayerPicker onPick={onPlayerPick} disabled={isBusy} />
      )}
    </li>
  );
}
