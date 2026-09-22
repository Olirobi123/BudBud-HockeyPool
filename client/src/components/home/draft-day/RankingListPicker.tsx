import { JSX } from 'react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import type { ListeClassement } from '@/types/IDraftDay';

interface RankingListPickerProps {
  listes: ListeClassement[];
  selectedId: number;
  onChange: (id: number) => void;
}

// eslint-disable-next-line import/prefer-default-export
export function RankingListPicker({ listes, selectedId, onChange }: RankingListPickerProps): JSX.Element {
  return (
    <Select value={String(selectedId)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-full sm:w-80" aria-label="Choisir une liste">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {listes.map((liste) => (
          <SelectItem key={liste.id} value={String(liste.id)}>
            {liste.nom}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
