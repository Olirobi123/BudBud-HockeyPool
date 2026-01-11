import { useState, useMemo } from 'react';
import { DraftPick, DraftType } from '@/types/IDraft';

export function useDraftFilters(draftPicks: DraftPick[] = [], types: DraftType[] = []) {
  // Compute available years and teams
  const annees = useMemo(() => Array.from(new Set(draftPicks.map((pick) => pick.annee))).sort((a, b) => b - a), [draftPicks]);
  const equipes = useMemo(() => Array.from(new Set(draftPicks.map((pick) => pick.nom))).sort(), [draftPicks]);

  // State for filters
  const [selectedYear, setSelectedYear] = useState(annees[0]);
  const [selectedType, setSelectedType] = useState(types[0]?.id ?? 1);
  const [selectedRound, setSelectedRound] = useState(0);
  const [selectedEquipe, setSelectedEquipe] = useState<string>('');

  // Filter picks by year and type
  const currentYearPicks = useMemo(() => draftPicks.filter((pick) => pick.annee === selectedYear && pick.type_id === selectedType), [draftPicks, selectedYear, selectedType]);

  // Available rounds for type 2
  const availableRounds = useMemo(() => (selectedType === 2 ? Array.from(new Set(currentYearPicks.map((pick) => pick.round))).sort((a, b) => a - b) : []), [currentYearPicks, selectedType]);

  // Filter by round
  const filteredPicks = useMemo(() => (selectedType === 2 && selectedRound !== 0 ? currentYearPicks.filter((pick) => pick.round === selectedRound) : currentYearPicks), [currentYearPicks, selectedType, selectedRound]);

  // Filter by team
  const filteredPicksEquipe = useMemo(() => (selectedEquipe ? filteredPicks.filter((pick) => pick.nom === selectedEquipe) : filteredPicks), [filteredPicks, selectedEquipe]);

  // Handlers for filter changes
  const handleYearChange = (year: number) => setSelectedYear(year);
  const handleTypeChange = (typeId: number) => {
    setSelectedType(typeId);
    setSelectedRound(0);
  };
  const handleRoundChange = (round: number) => setSelectedRound(round);
  const handleEquipeChange = (equipe: string) => setSelectedEquipe(equipe);

  return {
    annees,
    equipes,
    selectedYear,
    setSelectedYear: handleYearChange,
    selectedType,
    setSelectedType: handleTypeChange,
    selectedRound,
    setSelectedRound: handleRoundChange,
    selectedEquipe,
    setSelectedEquipe: handleEquipeChange,
    availableRounds,
    filteredPicksEquipe,
    types,
  };
}
