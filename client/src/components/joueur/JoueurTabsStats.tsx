import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  player: PlayerDetails;
};

export default function JoueurTabsStats({ player }: Props) {
  return (
    <TabsContent value="stats">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques par saison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {(() => {
              const statsTotals = player.seasonTotals.reduce((acc, curr) => {
                const key = curr.gameTypeId === 3 ? 'playoffs' : 'regular';
                if (curr.leagueAbbrev === 'NHL') {
                  if (player.position === 'G') {
                    acc[key] = {
                      gamesPlayed: (acc[key]?.gamesPlayed || 0) + (curr.gamesPlayed || 0),
                      wins: (acc[key]?.wins || 0) + (curr.wins || 0),
                      losses: (acc[key]?.losses || 0) + (curr.losses || 0),
                      otLosses: (acc[key]?.otLosses || 0) + (curr.otLosses || 0),
                      shutouts: (acc[key]?.shutouts || 0) + (curr.shutouts || 0),
                      savePctg: acc[key]?.savePctg
                        ? ((acc[key].savePctg * acc[key].gamesPlayed + (curr.savePctg || 0) * (curr.gamesPlayed || 0))
                                       / (acc[key].gamesPlayed + (curr.gamesPlayed || 0)))
                        : curr.savePctg,
                      goalsAgainstAvg: acc[key]?.goalsAgainstAvg
                        ? ((acc[key].goalsAgainstAvg * acc[key].gamesPlayed + (curr.goalsAgainstAvg || 0) * (curr.gamesPlayed || 0))
                                       / (acc[key].gamesPlayed + (curr.gamesPlayed || 0)))
                        : curr.goalsAgainstAvg,
                    };
                  } else {
                    acc[key] = {
                      gamesPlayed: (acc[key]?.gamesPlayed || 0) + (curr.gamesPlayed || 0),
                      goals: (acc[key]?.goals || 0) + (curr.goals || 0),
                      assists: (acc[key]?.assists || 0) + (curr.assists || 0),
                      points: (acc[key]?.points || 0) + (curr.points || 0),
                    };
                  }
                }
                return acc;
              }, { regular: {}, playoffs: {} } as Record<string, any>);

              return (
                <>
                  {(statsTotals.regular.gamesPlayed > 0 || statsTotals.playoffs.gamesPlayed > 0) && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {statsTotals.regular.gamesPlayed > 0 && (
                    <Card className="bg-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Total NHL - Saison régulière</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4" style={{ gridTemplateColumns: '0.8fr 1.2fr 0.8fr 0.8fr 0.8fr' }}>
                          {player.position === 'G' ? (
                            <>
                              <div>
                                <p className="text-sm font-medium">PJ</p>
                                <p className="text-xl font-bold">{statsTotals.regular.gamesPlayed}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">V-D-DP</p>
                                <p className="text-xl font-bold">
                                  {statsTotals.regular.wins}
                                  -
                                      {statsTotals.regular.losses}
                                  -
                                      {statsTotals.regular.otLosses}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">BL</p>
                                <p className="text-xl font-bold">{statsTotals.regular.shutouts}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">%ARR</p>
                                <p className="text-xl font-bold">
                                  {statsTotals.regular.savePctg ? `${(statsTotals.regular.savePctg * 100).toFixed(1)}%` : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">MOY</p>
                                <p className="text-xl font-bold">
                                  {statsTotals.regular.goalsAgainstAvg ? statsTotals.regular.goalsAgainstAvg.toFixed(2) : '-'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-sm font-medium">PJ</p>
                                <p className="text-xl font-bold">{statsTotals.regular.gamesPlayed}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">B</p>
                                <p className="text-xl font-bold">{statsTotals.regular.goals}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">P</p>
                                <p className="text-xl font-bold">{statsTotals.regular.assists}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">PTS</p>
                                <p className="text-xl font-bold">{statsTotals.regular.points}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">PPM</p>
                                <p className="text-xl font-bold">
                                      {(statsTotals.regular.points / statsTotals.regular.gamesPlayed).toFixed(2)}
                                    </p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    )}

                    {statsTotals.playoffs.gamesPlayed > 0 && (
                    <Card className="bg-yellow-500/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Total NHL - Séries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4" style={{ gridTemplateColumns: '0.8fr 1.2fr 0.8fr 0.8fr 0.8fr' }}>
                          {player.position === 'G' ? (
                            <>
                              <div>
                                <p className="text-sm font-medium">PJ</p>
                                <p className="text-xl font-bold">{statsTotals.playoffs.gamesPlayed}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">V-D-DP</p>
                                <p className="text-xl font-bold">
                                  {statsTotals.playoffs.wins}
                                  -
                                      {statsTotals.playoffs.losses}
                                  -
                                      {statsTotals.playoffs.otLosses}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">BL</p>
                                <p className="text-xl font-bold">{statsTotals.playoffs.shutouts}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">%ARR</p>
                                <p className="text-xl font-bold">
                                  {statsTotals.playoffs.savePctg ? `${(statsTotals.playoffs.savePctg * 100).toFixed(1)}%` : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">MOY</p>
                                <p className="text-xl font-bold">
                                  {statsTotals.playoffs.goalsAgainstAvg ? statsTotals.playoffs.goalsAgainstAvg.toFixed(2) : '-'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-sm font-medium">PJ</p>
                                <p className="text-xl font-bold">{statsTotals.playoffs.gamesPlayed}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">B</p>
                                <p className="text-xl font-bold">{statsTotals.playoffs.goals}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">P</p>
                                <p className="text-xl font-bold">{statsTotals.playoffs.assists}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">PTS</p>
                                <p className="text-xl font-bold">{statsTotals.playoffs.points}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">PPM</p>
                                <p className="text-xl font-bold">
                                      {(statsTotals.playoffs.points / statsTotals.playoffs.gamesPlayed).toFixed(2)}
                                    </p>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    )}
                  </div>
                  )}

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Saison</TableHead>
                        <TableHead>Ligue</TableHead>
                        <TableHead>Équipe</TableHead>
                        <TableHead>Type</TableHead>
                        {player.position === 'G' ? (
                          <>
                            <TableHead>PJ</TableHead>
                            <TableHead>V</TableHead>
                            <TableHead>D</TableHead>
                            <TableHead>DP</TableHead>
                            <TableHead>BL</TableHead>
                            <TableHead>%ARR</TableHead>
                            <TableHead>MOY</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead>PJ</TableHead>
                            <TableHead>B</TableHead>
                            <TableHead>P</TableHead>
                            <TableHead>PTS</TableHead>
                            <TableHead>PPM</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {player.seasonTotals
                        .sort((a, b) => {
                          const seasonDiff = b.season - a.season;
                          if (seasonDiff !== 0) return seasonDiff;
                          return (b.gameTypeId || 0) - (a.gameTypeId || 0);
                        })
                        .map((season) => (
                          <TableRow
                            key={`${season.season}-${season.leagueAbbrev}-${season.gameTypeId}`}
                            className={
                                          season.leagueAbbrev === 'NHL'
                                            ? season.gameTypeId === 3
                                              ? 'bg-yellow-500/10'
                                              : 'bg-primary/10'
                                            : ''
                                        }
                          >
                            <TableCell>{season.season}</TableCell>
                            <TableCell>{season.leagueAbbrev}</TableCell>
                            <TableCell>{season.teamName.default}</TableCell>
                            <TableCell>
                              <Badge variant={season.gameTypeId === 3 ? 'destructive' : 'default'}>
                                {season.gameTypeId === 3 ? 'Séries' : 'Régulière'}
                              </Badge>
                            </TableCell>
                            {player.position === 'G' ? (
                              <>
                                <TableCell>{season.gamesPlayed || '-'}</TableCell>
                                <TableCell>{season.wins || '-'}</TableCell>
                                <TableCell>{season.losses || '-'}</TableCell>
                                <TableCell>{season.otLosses || '-'}</TableCell>
                                <TableCell>{season.shutouts || '-'}</TableCell>
                                <TableCell>
                                  {season.savePctg ? `${(season.savePctg * 100).toFixed(1)}%` : '-'}
                                </TableCell>
                                <TableCell>
                                  {season.goalsAgainstAvg ? season.goalsAgainstAvg.toFixed(2) : '-'}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{season.gamesPlayed || '-'}</TableCell>
                                <TableCell>{season.goals || '-'}</TableCell>
                                <TableCell>{season.assists || '-'}</TableCell>
                                <TableCell>{season.points || '-'}</TableCell>
                                <TableCell>
                                  {season.gamesPlayed && season.points
                                    ? (season.points / season.gamesPlayed).toFixed(2)
                                    : '-'}
                                </TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
