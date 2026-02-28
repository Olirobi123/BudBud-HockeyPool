import { useState, useMemo } from 'react';
import Echange from '@/types/IEchange';

interface UseEchangesFiltersReturn {
  teams: string[];
  years: string[];
  selectedTeam: string;
  setSelectedTeam: (v: string) => void;
  selectedYear: string;
  setSelectedYear: (v: string) => void;
  filtered: Echange[];
  hasActiveFilter: boolean;
}

export default function useEchangesFilters(echanges: Echange[]): UseEchangesFiltersReturn {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const teams = useMemo(() => {
    const teamSet = new Set<string>();
    echanges.forEach((e) => {
      teamSet.add(e.equipe_source_nom);
      teamSet.add(e.equipe_destination_nom);
    });
    return Array.from(teamSet).sort((a, b) => a.localeCompare(b));
  }, [echanges]);

  const years = useMemo(() => {
    const seasonSet = new Set<string>();
    echanges.forEach((e) => {
      const [y, m] = e.date.split('-').map(Number);
      const season = m >= 9 ? String(y + 1) : String(y);
      seasonSet.add(season);
    });
    return Array.from(seasonSet).sort((a, b) => b.localeCompare(a));
  }, [echanges]);

  const filtered = useMemo(
    () => echanges.filter((e) => {
      const teamMatch = selectedTeam === ''
        || e.equipe_source_nom === selectedTeam
        || e.equipe_destination_nom === selectedTeam;
      const yearMatch = selectedYear === ''
        || (e.date >= `${Number(selectedYear) - 1}-09-01`
          && e.date < `${selectedYear}-09-01`);
      return teamMatch && yearMatch;
    }),
    [echanges, selectedTeam, selectedYear],
  );

  const hasActiveFilter = selectedTeam !== '' || selectedYear !== '';

  return {
    teams,
    years,
    selectedTeam,
    setSelectedTeam,
    selectedYear,
    setSelectedYear,
    filtered,
    hasActiveFilter,
  };
}
