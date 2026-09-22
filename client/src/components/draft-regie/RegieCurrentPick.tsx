import { JSX } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { DraftBoardPick, DraftProspectSearchResult } from '@/types/IDraftDay';
import { RegiePlayerPicker } from './RegiePlayerPicker';

interface RegieCurrentPickProps {
  pick: DraftBoardPick | null;
  isBusy: boolean;
  onPlayerPick: (player: DraftProspectSearchResult) => void;
}

/** Le choix en cours, en grand : c'est ici qu'on entre les joueurs pendant la soirée. */
// eslint-disable-next-line import/prefer-default-export
export function RegieCurrentPick({ pick, isBusy, onPlayerPick }: RegieCurrentPickProps): JSX.Element {
  return (
    <Card className="border-live">
      <CardContent className="space-y-4 p-4 sm:p-6">
        {pick === null ? (
          <p className="font-display text-lg font-semibold text-foreground">Tous les choix sont faits.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-xs font-semibold uppercase tracking-wider text-live">Au choix</span>
              <span className="font-display text-2xl font-bold tabular-nums text-foreground">{`#${pick.rang}`}</span>
              <span className="text-xl font-semibold text-foreground">{pick.equipeNom.trim()}</span>
              <span className="text-sm text-muted-foreground">
                {`Ronde ${pick.round}, choix ${pick.pickInRound}`}
                {pick.sourceNom !== null && ` · via ${pick.sourceNom.trim()}`}
              </span>
            </div>
            {/* key : le champ se vide et reprend le focus à chaque nouveau choix. */}
            <RegiePlayerPicker key={pick.rang} onPick={onPlayerPick} disabled={isBusy} size="large" autoFocus />
            <p className="text-xs text-muted-foreground">
              Entrée choisit le premier résultat s&apos;il correspond au nom tapé. Le joueur est créé au besoin et ajouté à l&apos;alignement de l&apos;équipe.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
