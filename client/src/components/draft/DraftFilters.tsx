import React from 'react';
import { DraftType } from '@/types/IDraft';
import { formatAnnee } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

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

export function DraftFilters({
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
}: DraftFiltersProps): JSX.Element {
  // Defensive programming: ensure arrays are defined
  const safeAnnees = Array.isArray(annees) ? annees : [];
  const safeEquipes = Array.isArray(equipes) ? equipes : [];
  const safeTypes = Array.isArray(types) ? types : [];
  const safeAvailableRounds = Array.isArray(availableRounds)
    ? availableRounds
    : [];

  return (
    <Card className="mb-6 border-border/50 shadow-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Year Filter */}
          <div className="space-y-2">
            <Label
              htmlFor="year-select"
              className="text-sm font-medium text-foreground"
            >
              Année
            </Label>
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger
                id="year-select"
                className="border-border/50 hover:border-primary/50 transition-colors"
              >
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {safeAnnees.map((annee) => (
                  <SelectItem key={annee} value={String(annee)}>
                    {formatAnnee(annee)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label
              htmlFor="type-select"
              className="text-sm font-medium text-foreground"
            >
              Type
            </Label>
            <Select
              value={String(selectedType)}
              onValueChange={(value) => setSelectedType(Number(value))}
              disabled={isTypesLoading}
            >
              <SelectTrigger
                id="type-select"
                className="border-border/50 hover:border-primary/50 transition-colors"
              >
                <SelectValue
                  placeholder={isTypesLoading ? 'Chargement...' : 'Type'}
                />
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

          {/* Round Filter - Conditional */}
          {selectedType === 2 && (
            <div className="space-y-2">
              <Label
                htmlFor="round-select"
                className="text-sm font-medium text-foreground"
              >
                Ronde
              </Label>
              <Select
                value={String(selectedRound)}
                onValueChange={(value) => setSelectedRound(Number(value))}
              >
                <SelectTrigger
                  id="round-select"
                  className="border-border/50 hover:border-primary/50 transition-colors"
                >
                  <SelectValue placeholder="Ronde" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Toutes les rondes</SelectItem>
                  {safeAvailableRounds.map((round) => (
                    <SelectItem key={round} value={String(round)}>
                      Ronde
                      {' '}
                      {round}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Team Filter */}
          <div className="space-y-2">
            <Label
              htmlFor="team-select"
              className="text-sm font-medium text-foreground"
            >
              Équipe
            </Label>
            <Select
              value={selectedEquipe || 'all'}
              onValueChange={(value) => setSelectedEquipe(value === 'all' ? '' : value)}
            >
              <SelectTrigger
                id="team-select"
                className="border-border/50 hover:border-primary/50 transition-colors"
              >
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les équipes</SelectItem>
                {safeEquipes.map((equipe) => (
                  <SelectItem key={equipe} value={equipe}>
                    {equipe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
