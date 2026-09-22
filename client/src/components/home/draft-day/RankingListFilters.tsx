import { JSX } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { ListeOwnershipFilter, ListePositionFilter } from '@/types/IDraftDay';
import { SegmentedControl } from './SegmentedControl';

const POSITIONS: { value: ListePositionFilter; label: string }[] = [
  { value: 'ALL', label: 'Tous' },
  { value: 'C', label: 'C' },
  { value: 'LW', label: 'LW' },
  { value: 'RW', label: 'RW' },
  { value: 'D', label: 'D' },
  { value: 'G', label: 'G' },
];

const OWNERSHIP: { value: ListeOwnershipFilter; label: string }[] = [
  { value: 'ALL', label: 'Tous' },
  { value: 'AVAILABLE', label: 'Disponibles' },
  { value: 'OWNED', label: 'Pris' },
];

interface RankingListFiltersProps {
  position: ListePositionFilter;
  onPositionChange: (value: ListePositionFilter) => void;
  ownership: ListeOwnershipFilter;
  onOwnershipChange: (value: ListeOwnershipFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

// eslint-disable-next-line import/prefer-default-export
export function RankingListFilters({
  position,
  onPositionChange,
  ownership,
  onOwnershipChange,
  search,
  onSearchChange,
}: RankingListFiltersProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <SegmentedControl label="Position" options={POSITIONS} value={position} onChange={onPositionChange} />
        <SegmentedControl label="Propriété" options={OWNERSHIP} value={ownership} onChange={onOwnershipChange} />
      </div>
      <div className="relative w-full lg:w-64">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un joueur…"
          aria-label="Rechercher un joueur dans la liste"
          className="pl-9"
        />
      </div>
    </div>
  );
}
