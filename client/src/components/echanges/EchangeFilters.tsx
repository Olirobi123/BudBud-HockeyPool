import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EchangeFiltersProps {
  teams: string[];
  years: string[];
  selectedTeam: string;
  setSelectedTeam: (v: string) => void;
  selectedYear: string;
  setSelectedYear: (v: string) => void;
  hasActiveFilter: boolean;
  onReset: () => void;
  filteredCount: number;
}

export default function EchangeFilters({
  teams,
  years,
  selectedTeam,
  setSelectedTeam,
  selectedYear,
  setSelectedYear,
  hasActiveFilter,
  onReset,
}: EchangeFiltersProps): JSX.Element {
  return (
    <div className="bg-muted/40 border border-border rounded-xl px-4 py-3 mb-6">
      {/* Desktop layout */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold whitespace-nowrap">
          Filtres
        </span>

        <Select
          value={selectedTeam || 'all'}
          onValueChange={(v) => setSelectedTeam(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9 min-w-[160px]">
            <SelectValue placeholder="Toutes les équipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>{team}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedYear || 'all'}
          onValueChange={(v) => setSelectedYear(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9 min-w-[140px]">
            <SelectValue placeholder="Toutes les saisons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les saisons</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>Saison {year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="w-3.5 h-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Filtres
        </span>
        <Select
          value={selectedTeam || 'all'}
          onValueChange={(v) => setSelectedTeam(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Toutes les équipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>{team}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedYear || 'all'}
          onValueChange={(v) => setSelectedYear(v === 'all' ? '' : v)}
        >
          <SelectTrigger className="h-9 w-full">
            <SelectValue placeholder="Toutes les saisons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les saisons</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>Saison {year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilter && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-9 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
