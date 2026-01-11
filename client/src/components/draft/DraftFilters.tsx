import React from 'react';
import { DraftType } from '@/types/IDraft';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DraftFiltersProps {
  annees?: number[];
  equipes?: string[];
  types?: DraftType[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedType: number;
  setSelectedType: (typeId: number) => void;
  selectedRound: number;
  setSelectedRound: (round: number) => void;
  selectedEquipe: string;
  setSelectedEquipe: (equipe: string) => void;
  availableRounds?: number[];
  isTypesLoading: boolean;
}

export const DraftFilters: React.FC<DraftFiltersProps> = ({
  annees,
  equipes,
  types,
  selectedYear,
  setSelectedYear,
  selectedType,
  setSelectedType,
  selectedRound,
  setSelectedRound,
  selectedEquipe,
  setSelectedEquipe,
  availableRounds,
  isTypesLoading,
}) => {
  // Defensive programming: ensure arrays are defined
  const safeAnnees = Array.isArray(annees) ? annees : [];
  const safeEquipes = Array.isArray(equipes) ? equipes : [];
  const safeTypes = Array.isArray(types) ? types : [];
  const safeAvailableRounds = Array.isArray(availableRounds) ? availableRounds : [];

  return (
    <div className="flex flex-wrap gap-4 items-end bg-card rounded-lg shadow-sm p-4 border border-border mb-4">
      <div className="space-y-2">
        <Label htmlFor="year-select" className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Année
        </Label>
        <Select value={String(selectedYear)} onValueChange={(value) => setSelectedYear(Number(value))}>
          <SelectTrigger id="year-select" className="w-auto min-w-[100px]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {safeAnnees.map((annee) => (
              <SelectItem key={annee} value={String(annee)}>
                {annee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-select" className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Type
        </Label>
        <Select
          value={String(selectedType)}
          onValueChange={(value) => setSelectedType(Number(value))}
          disabled={isTypesLoading}
        >
          <SelectTrigger id="type-select" className="w-auto min-w-[140px]">
            <SelectValue placeholder={isTypesLoading ? 'Chargement...' : 'Type'} />
          </SelectTrigger>
          <SelectContent>
            {safeTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedType === 2 && (
        <div className="space-y-2">
          <Label htmlFor="round-select" className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Ronde
          </Label>
          <Select value={String(selectedRound)} onValueChange={(value) => setSelectedRound(Number(value))}>
            <SelectTrigger id="round-select" className="w-auto min-w-[140px]">
              <SelectValue placeholder="Ronde" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Toutes les rondes</SelectItem>
              {safeAvailableRounds.map((round) => (
                <SelectItem key={round} value={String(round)}>
                  Ronde {round}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="team-select" className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Équipe
        </Label>
        <Select value={selectedEquipe || 'all'} onValueChange={(value) => setSelectedEquipe(value === 'all' ? '' : value)}>
          <SelectTrigger id="team-select" className="w-auto min-w-[140px]">
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            {safeEquipes.map((equipe) => (
              <SelectItem key={equipe} value={equipe}>
                {equipe}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
