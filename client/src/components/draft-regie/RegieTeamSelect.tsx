import { JSX } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type Equipe from '@/types/IEquipes';

interface RegieTeamSelectProps {
  equipes: Equipe[];
  value: number;
  onChange: (equipeId: number) => void;
  disabled: boolean;
  rang: number;
}

// eslint-disable-next-line import/prefer-default-export
export function RegieTeamSelect({
  equipes, value, onChange, disabled, rang,
}: RegieTeamSelectProps): JSX.Element {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))} disabled={disabled}>
      <SelectTrigger className="h-9" aria-label={`Équipe au choix #${rang}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {equipes.map((e) => (
          <SelectItem key={e.id} value={String(e.id)}>{e.nom.trim()}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
