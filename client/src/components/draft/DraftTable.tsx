import React from 'react';
import { DraftPick } from '@/types/IDraft';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DraftTableProps {
  filteredPicksEquipe?: DraftPick[];
  selectedType: number;
  selectedRound: number;
  availableRounds?: number[];
}

export const DraftTable: React.FC<DraftTableProps> = ({
  filteredPicksEquipe,
  selectedType,
  selectedRound,
  availableRounds,
}) => {
  // Defensive programming: ensure arrays are defined
  const safeFilteredPicksEquipe = Array.isArray(filteredPicksEquipe) ? filteredPicksEquipe : [];
  const safeAvailableRounds = Array.isArray(availableRounds) ? availableRounds : [];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rang</TableHead>
            <TableHead>Équipe</TableHead>
            <TableHead>Joueur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeFilteredPicksEquipe.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                Aucun choix pour cette sélection
              </TableCell>
            </TableRow>
          ) : selectedType === 2 ? (
            safeAvailableRounds
              .filter((round) => selectedRound === 0 || round === selectedRound)
              .map((round) => [
                <TableRow key={`header-round-${round}`} className="bg-muted border-t-2">
                  <TableCell colSpan={3} className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Ronde {round}
                  </TableCell>
                </TableRow>,
                ...safeFilteredPicksEquipe
                  .filter((pick) => pick.round === round)
                  .map((pick) => (
                    <TableRow key={pick.rang}>
                      <TableCell>{pick.rang}</TableCell>
                      <TableCell>{pick.nom}</TableCell>
                      <TableCell className="font-medium">{pick.joueur}</TableCell>
                    </TableRow>
                  )),
              ])
          ) : (
            safeFilteredPicksEquipe.map((pick) => (
              <TableRow key={pick.rang}>
                <TableCell>{pick.rang}</TableCell>
                <TableCell>{pick.nom}</TableCell>
                <TableCell className="font-medium">{pick.joueur}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
