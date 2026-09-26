import { JSX, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type Equipe from '@/types/IEquipes';
import { RegieTeamSelect } from './RegieTeamSelect';

interface RegieAddPickProps {
  equipes: Equipe[];
  nextRang: number;
  isBusy: boolean;
  onAdd: (equipeId: number) => void;
}

/** Ajoute un choix à la fin de la ronde dynamique. */
// eslint-disable-next-line import/prefer-default-export
export function RegieAddPick({
  equipes, nextRang, isBusy, onAdd,
}: RegieAddPickProps): JSX.Element | null {
  const [selected, setSelected] = useState<number | null>(null);
  const equipeId = selected ?? equipes[0]?.id;
  if (equipeId === undefined) return null;

  return (
    <div className="grid grid-cols-1 gap-2 border-t border-border px-3 py-3 sm:grid-cols-[3rem_17rem_auto] sm:items-center">
      <span className="font-display text-sm tabular-nums text-muted-foreground/60">{`#${nextRang}`}</span>
      <RegieTeamSelect equipes={equipes} value={equipeId} onChange={setSelected} disabled={isBusy} rang={nextRang} />
      <Button variant="outline" size="sm" className="justify-self-start" onClick={() => onAdd(equipeId)} disabled={isBusy}>
        <Plus className="mr-1 h-4 w-4" />
        Ajouter un choix
      </Button>
    </div>
  );
}
