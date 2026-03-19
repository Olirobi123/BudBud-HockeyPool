import React from 'react';
import { Search } from 'lucide-react';
import { DraftPick } from '@/types/IDraft';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';

interface DraftTableProps {
  filteredPicksEquipe?: DraftPick[];
  selectedType: number;
  selectedRound: number;
  availableRounds?: number[];
}

export function DraftTable({
  filteredPicksEquipe,
  selectedType,
  selectedRound,
  availableRounds,
}: DraftTableProps): JSX.Element {
  // Defensive programming: ensure arrays are defined
  const safeFilteredPicksEquipe = Array.isArray(filteredPicksEquipe)
    ? filteredPicksEquipe
    : [];
  const safeAvailableRounds = Array.isArray(availableRounds)
    ? availableRounds
    : [];

  if (safeFilteredPicksEquipe.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="py-16 px-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">
                Aucun choix trouvé
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Aucun choix de repêchage ne correspond à vos critères de sélection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For "Draft annuel" (type 2), group by rounds
  if (selectedType === 2) {
    const roundsToShow = safeAvailableRounds.filter(
      (round) => selectedRound === 0 || round === selectedRound,
    );

    return (
      <div className="space-y-6">
        {roundsToShow.map((round) => {
          const picksInRound = safeFilteredPicksEquipe.filter(
            (pick) => pick.round === round,
          );

          if (picksInRound.length === 0) return null;

          return (
            <Card key={`round-${round}`} className="border-border/50 shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border/50">
                <CardTitle className="text-lg font-semibold flex items-center gap-3">
                  <span className="text-primary">
                    Ronde
                    {' '}
                    {round}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    •
                    {' '}
                    {picksInRound.length}
                    {' '}
                    choix
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-24 font-semibold">Rang</TableHead>
                        <TableHead className="font-semibold">Équipe</TableHead>
                        <TableHead className="font-semibold">Joueur</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {picksInRound.map((pick) => (
                        <TableRow
                          key={pick.rang}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-semibold text-foreground">
                            {pick.rang}
                          </TableCell>
                          <TableCell className="text-foreground">
                            {pick.nom}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {pick.joueur}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // For other types, show all picks in a single table
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24 font-semibold">Rang</TableHead>
                <TableHead className="font-semibold">Équipe</TableHead>
                <TableHead className="font-semibold">Joueur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeFilteredPicksEquipe.map((pick) => (
                <TableRow
                  key={pick.rang}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-semibold text-foreground">
                    {pick.rang}
                  </TableCell>
                  <TableCell className="text-foreground">{pick.nom}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {pick.joueur}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
