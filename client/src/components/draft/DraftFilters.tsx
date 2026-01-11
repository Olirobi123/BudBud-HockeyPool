import React from 'react';
import { DraftType } from '@/types/IDraft';

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
    <div className="flex flex-wrap gap-4 items-end bg-white rounded-lg shadow p-4 border border-gray-200 mb-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Année</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {safeAnnees.map((annee) => (
            <option key={annee} value={annee}>{annee}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Type</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={selectedType}
          onChange={(e) => setSelectedType(Number(e.target.value))}
        >
          {isTypesLoading ? (
            <option>Chargement...</option>
          ) : (
            safeTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.nom}</option>
            ))
          )}
        </select>
      </div>
      {selectedType === 2 && (
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Ronde</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={selectedRound}
          onChange={(e) => setSelectedRound(Number(e.target.value))}
        >
          <option value={0}>Toutes les rondes</option>
          {safeAvailableRounds.map((round) => (
            <option key={round} value={round}>
              Ronde
              {round}
            </option>
          ))}
        </select>
      </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Équipe</label>
        <select
          className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
          value={selectedEquipe}
          onChange={(e) => setSelectedEquipe(e.target.value)}
        >
          <option value="">Toutes</option>
          {safeEquipes.map((equipe) => (
            <option key={equipe} value={equipe}>{equipe}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
