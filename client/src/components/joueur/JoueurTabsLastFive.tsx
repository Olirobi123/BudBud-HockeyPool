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
        <CardHeader>
          <CardTitle>Historique des matchs</CardTitle>
        </CardHeader>
        <CardContent>
          {player.last5Games ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>vs</TableHead>
                  {player.position === 'G' ? (
                    <>
                      <TableHead>DÉC</TableHead>
                      <TableHead>BC</TableHead>
                      <TableHead>ARR</TableHead>
                      <TableHead>%</TableHead>
                      <TableHead>TJ</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>B</TableHead>
                      <TableHead>P</TableHead>
                      <TableHead>PTS</TableHead>
                      <TableHead>+/-</TableHead>
                      <TableHead>TJ</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {player.last5Games.map((game) => (
                  <TableRow key={game.gameDate}>
                    <TableCell>{format(new Date(game.gameDate), 'd MMM', { locale: fr })}</TableCell>
                    <TableCell>
                      {game.homeRoadFlag === 'H' ? 'vs' : '@'}
                      {' '}
                      {game.opponentAbbrev}
                    </TableCell>
                    {player.position === 'G' ? (
                      <>
                        <TableCell>{game.decision || '-'}</TableCell>
                        <TableCell>{game.goalsAgainst}</TableCell>
                        <TableCell>{game.shotsAgainst}</TableCell>
                        <TableCell>{game.savePctg ? `${(game.savePctg * 100).toFixed(1)}%` : '-'}</TableCell>
                        <TableCell>{game.toi}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{game.goals}</TableCell>
                        <TableCell>{game.assists}</TableCell>
                        <TableCell>{game.points}</TableCell>
                        <TableCell>{game.plusMinus}</TableCell>
                        <TableCell>{game.toi}</TableCell>
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
