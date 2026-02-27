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
  filteredCount,
}: EchangeFiltersProps): JSX.Element {
  const countBadgeClass = hasActiveFilter
    ? 'bg-slate-800/80 border-cyan-500/30 text-cyan-400'
    : 'bg-slate-800/80 border-slate-700/60 text-slate-300';

  const countLabel = `${filteredCount} échange${filteredCount !== 1 ? 's' : ''}`;

  return (
    <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl px-4 py-3 mb-6">
      {/* Desktop layout */}
      <div className="hidden sm:flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-semibold whitespace-nowrap">
          Filtres
        </span>

        {/* Team select */}
        <Select
          value={selectedTeam || 'all'}
          onValueChange={(v) => setSelectedTeam(v === 'all' ? '' : v)}
        >
          <SelectTrigger
            className={
              'h-9 min-w-[160px] bg-slate-800/60 border-slate-700/60'
              + ' text-slate-200 hover:border-cyan-500/40 focus:ring-cyan-500/30'
            }
          >
            <SelectValue placeholder="Toutes les équipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year select */}
        <Select
          value={selectedYear || 'all'}
          onValueChange={(v) => setSelectedYear(v === 'all' ? '' : v)}
        >
          <SelectTrigger
            className={
              'h-9 min-w-[140px] bg-slate-800/60 border-slate-700/60'
              + ' text-slate-200 hover:border-cyan-500/40 focus:ring-cyan-500/30'
            }
          >
            <SelectValue placeholder="Toutes les années" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les années</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Count badge */}
        <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono border ${countBadgeClass}`}>
          {hasActiveFilter && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          )}
          {countLabel}
        </div>

        {/* Reset button — only when filter is active */}
        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className={
              'h-9 gap-1.5 text-xs text-slate-400 hover:text-red-400'
              + ' hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
            }
          >
            <X className="w-3.5 h-3.5" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Team select */}
        <Select
          value={selectedTeam || 'all'}
          onValueChange={(v) => setSelectedTeam(v === 'all' ? '' : v)}
        >
          <SelectTrigger
            className={
              'h-9 w-full bg-slate-800/60 border-slate-700/60'
              + ' text-slate-200 hover:border-cyan-500/40 focus:ring-cyan-500/30'
            }
          >
            <SelectValue placeholder="Toutes les équipes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team} value={team}>
                {team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year select */}
        <Select
          value={selectedYear || 'all'}
          onValueChange={(v) => setSelectedYear(v === 'all' ? '' : v)}
        >
          <SelectTrigger
            className={
              'h-9 w-full bg-slate-800/60 border-slate-700/60'
              + ' text-slate-200 hover:border-cyan-500/40 focus:ring-cyan-500/30'
            }
          >
            <SelectValue placeholder="Toutes les années" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les années</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bottom row: count badge + reset */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono border ${countBadgeClass}`}>
            {hasActiveFilter && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
            {countLabel}
          </div>

          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className={
                'h-9 gap-1.5 text-xs text-slate-400 hover:text-red-400'
                + ' hover:bg-red-500/10 border border-transparent hover:border-red-500/20'
              }
            >
              <X className="w-3.5 h-3.5" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
