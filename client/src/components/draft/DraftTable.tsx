import React from 'react';
import { DraftPick } from '@/types/IDraft';

interface DraftTableProps {
  filteredPicksEquipe: DraftPick[];
  selectedType: number;
  selectedRound: number;
  availableRounds: number[];
}

export const DraftTable: React.FC<DraftTableProps> = ({
  filteredPicksEquipe,
  selectedType,
  selectedRound,
  availableRounds,
}) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
    <table className="w-full text-sm">
      <thead className="bg-gray-100">
        <tr className="border-b border-gray-200">
          <th className="py-2 px-2 font-normal text-gray-700 text-left">Rang</th>
          <th className="py-2 px-2 font-normal text-gray-700 text-left">Équipe</th>
          <th className="py-2 px-2 font-normal text-gray-700 text-left">Joueur</th>
        </tr>
      </thead>
      <tbody>
        {filteredPicksEquipe && filteredPicksEquipe.length === 0 ? (
          <tr>
            <td colSpan={3} className="text-center py-6 text-gray-400">Aucun choix pour cette sélection</td>
          </tr>
        ) : selectedType === 2 && filteredPicksEquipe ? (
          availableRounds
            .filter((round) => selectedRound === 0 || round === selectedRound)
            .map((round) => [
              <tr key={`header-round-${round}`} className="bg-gray-50 border-t-2 border-gray-300">
                <td colSpan={3} className="py-2 px-2 font-semibold text-gray-600 text-left uppercase tracking-wider">
                  Ronde{round}
                </td>
              </tr>,
              ...filteredPicksEquipe
                .filter((pick) => pick.round === round)
                .map((pick) => (
                  <tr key={pick.rang} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-2 px-2 text-gray-800">{pick.rang}</td>
                    <td className="py-2 px-2 text-gray-700">{pick.nom}</td>
                    <td className="py-2 px-2 text-gray-900">{pick.joueur}</td>
                  </tr>
                )),
            ])
        ) : (
          filteredPicksEquipe && filteredPicksEquipe.map((pick) => (
            <tr key={pick.rang} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="py-2 px-2 text-gray-800">{pick.rang}</td>
              <td className="py-2 px-2 text-gray-700">{pick.nom}</td>
              <td className="py-2 px-2 text-gray-900">{pick.joueur}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
); 