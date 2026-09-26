import { JSX } from 'react';
import { Trash2, X } from 'lucide-react';
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
  /** Présent seulement pour les choix de la ronde dynamique ; un choix fait doit d'abord être retiré. */
  // eslint-disable-next-line react/require-default-props
  onRemove?: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export function RegiePickRow({
  pick, equipes, isOnTheClock, isBusy, onTeamChange, onPlayerPick, onClear, onRemove,
}: RegiePickRowProps): JSX.Element {
  return (
    <li
      className={cn(
        'grid grid-cols-1 gap-2 border-l-2 px-3 py-3 sm:items-center',
        onRemove ? 'sm:grid-cols-[3rem_17rem_minmax(0,1fr)_auto]' : 'sm:grid-cols-[3rem_17rem_minmax(0,1fr)]',
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
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="justify-self-start text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          disabled={isBusy || pick.joueur !== null}
          title={pick.joueur !== null ? "Retirez d'abord le joueur" : undefined}
          aria-label={`Supprimer le choix #${pick.rang}`}
        >
          <Trash2 className="h-4 w-4" />
          <span className="ml-1 sm:hidden">Supprimer le choix</span>
        </Button>
      )}
    </li>
  );
}
