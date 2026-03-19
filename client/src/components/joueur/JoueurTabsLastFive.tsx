import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  player: PlayerDetails;
};

export default function JoueurTabsLastFive({ player }: Props) {
  return (
    <TabsContent value="derniers-matchs">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle>Historique des matchs</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          {player.last5Games ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-1.5 sm:px-4">Date</TableHead>
                  <TableHead className="px-1.5 sm:px-4">vs</TableHead>
                  {player.position === 'G' ? (
                    <>
                      <TableHead className="px-1.5 sm:px-4">DÉC</TableHead>
                      <TableHead className="px-1.5 sm:px-4">BC</TableHead>
                      <TableHead className="px-1.5 sm:px-4 hidden sm:table-cell">ARR</TableHead>
                      <TableHead className="px-1.5 sm:px-4">%</TableHead>
                      <TableHead className="px-1.5 sm:px-4 hidden sm:table-cell">TJ</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="px-1.5 sm:px-4">B</TableHead>
                      <TableHead className="px-1.5 sm:px-4">P</TableHead>
                      <TableHead className="px-1.5 sm:px-4">PTS</TableHead>
                      <TableHead className="px-1.5 sm:px-4 hidden sm:table-cell">+/-</TableHead>
                      <TableHead className="px-1.5 sm:px-4">TJ</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {player.last5Games.map((game) => (
                  <TableRow key={game.gameDate}>
                    <TableCell className="px-1.5 sm:px-4 whitespace-nowrap">{game.gameDate ? format(new Date(game.gameDate), 'd MMM', { locale: fr }) : '-'}</TableCell>
                    <TableCell className="px-1.5 sm:px-4 whitespace-nowrap">
                      {game.homeRoadFlag === 'H' ? 'vs' : '@'}
                      {' '}
                      {game.opponentAbbrev}
                    </TableCell>
                    {player.position === 'G' ? (
                      <>
                        <TableCell className="px-1.5 sm:px-4">{game.decision || '-'}</TableCell>
                        <TableCell className="px-1.5 sm:px-4">{game.goalsAgainst}</TableCell>
                        <TableCell className="px-1.5 sm:px-4 hidden sm:table-cell">{game.shotsAgainst}</TableCell>
                        <TableCell className="px-1.5 sm:px-4">{game.savePctg ? `${(game.savePctg).toFixed(3)}` : '-'}</TableCell>
                        <TableCell className="px-1.5 sm:px-4 hidden sm:table-cell">{game.toi}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="px-1.5 sm:px-4">{game.goals}</TableCell>
                        <TableCell className="px-1.5 sm:px-4">{game.assists}</TableCell>
                        <TableCell className="px-1.5 sm:px-4">{game.points}</TableCell>
                        <TableCell className="px-1.5 sm:px-4 hidden sm:table-cell">{game.plusMinus}</TableCell>
                        <TableCell className="px-1.5 sm:px-4">{game.toi}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun match NHL disponible</p>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
