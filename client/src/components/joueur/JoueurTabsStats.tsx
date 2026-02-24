import { TabsContent } from '@/components/ui/tabs';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PlayerDetails from '@/types/IPlayerDetails';
import { formatSeason, formatSeasonShort } from '@/lib/utils';

type Props = {
  player: PlayerDetails;
};

interface StatsTotals {
  gamesPlayed: number;
  goals?: number;
  assists?: number;
  points?: number;
  wins?: number;
  losses?: number;
  otLosses?: number;
  shutouts?: number;
  savePctg?: number;
  goalsAgainstAvg?: number;
}

interface StatsAccumulator {
  regular: StatsTotals;
  playoffs: StatsTotals;
}

export default function JoueurTabsStats({ player }: Props) {
  return (
    <TabsContent value="stats">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <CardTitle>Statistiques par saison</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-6">
            {(() => {
              const initial: StatsAccumulator = {
                regular: { gamesPlayed: 0 },
                playoffs: { gamesPlayed: 0 },
              };

              const statsTotals = (player.seasonTotals ?? []).reduce((acc, curr) => {
                const key = curr.gameTypeId === 3 ? 'playoffs' : 'regular';
                if (curr.leagueAbbrev === 'NHL') {
                  if (player.position === 'G') {
                    acc[key] = {
                      gamesPlayed: (acc[key].gamesPlayed || 0) + (curr.gamesPlayed || 0),
                      wins: (acc[key].wins || 0) + (curr.wins || 0),
                      losses: (acc[key].losses || 0) + (curr.losses || 0),
                      otLosses: (acc[key].otLosses || 0) + (curr.otLosses || 0),
                      shutouts: (acc[key].shutouts || 0) + (curr.shutouts || 0),
                      savePctg: acc[key].savePctg
                        ? ((acc[key].savePctg * acc[key].gamesPlayed + (curr.savePctg || 0) * (curr.gamesPlayed || 0))
                                       / (acc[key].gamesPlayed + (curr.gamesPlayed || 0)))
                        : curr.savePctg,
                      goalsAgainstAvg: acc[key].goalsAgainstAvg
                        ? ((acc[key].goalsAgainstAvg * acc[key].gamesPlayed + (curr.goalsAgainstAvg || 0) * (curr.gamesPlayed || 0))
                                       / (acc[key].gamesPlayed + (curr.gamesPlayed || 0)))
                        : curr.goalsAgainstAvg,
                    };
                  } else {
                    acc[key] = {
                      gamesPlayed: (acc[key].gamesPlayed || 0) + (curr.gamesPlayed || 0),
                      goals: (acc[key].goals || 0) + (curr.goals || 0),
                      assists: (acc[key].assists || 0) + (curr.assists || 0),
                      points: (acc[key].points || 0) + (curr.points || 0),
                    };
                  }
                }
                return acc;
              }, initial);

              return (
                <>
                  {(statsTotals.regular.gamesPlayed > 0 || statsTotals.playoffs.gamesPlayed > 0) && (
                  <div className="grid gap-3 sm:gap-6 md:grid-cols-2">
                    {statsTotals.regular.gamesPlayed > 0 && (
                    <Card className="bg-primary/10">
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle className="text-sm sm:text-lg">Total NHL - Saison régulière</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="grid grid-cols-[0.8fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-1 sm:gap-4">
                          {player.position === 'G' ? (
                            <>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PJ</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.regular.gamesPlayed}</p>
                              </div>
                              <div className="mr-1 sm:mr-2">
                                <p className="text-xs sm:text-sm font-medium">V-D-DP</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.regular.wins ?? 0}
                                  -
                                  {statsTotals.regular.losses ?? 0}
                                  -
                                  {statsTotals.regular.otLosses ?? 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">BL</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.regular.shutouts ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">%ARR</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.regular.savePctg ? `${(statsTotals.regular.savePctg ).toFixed(3)}` : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">MOY</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.regular.goalsAgainstAvg ? statsTotals.regular.goalsAgainstAvg.toFixed(2) : '-'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PJ</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.regular.gamesPlayed}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">B</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.regular.goals ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">P</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.regular.assists ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PTS</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.regular.points ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PPM</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.regular.gamesPlayed
                                    ? ((statsTotals.regular.points ?? 0) / statsTotals.regular.gamesPlayed).toFixed(2)
                                    : '0.00'}
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
                      <CardHeader className="p-3 sm:p-6">
                        <CardTitle className="text-sm sm:text-lg">Total NHL - Séries</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="grid grid-cols-[0.8fr_1.2fr_0.8fr_0.8fr_0.8fr] gap-1 sm:gap-4">
                          {player.position === 'G' ? (
                            <>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PJ</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.playoffs.gamesPlayed}</p>
                              </div>
                              <div className="mr-1 sm:mr-2">
                                <p className="text-xs sm:text-sm font-medium">V-D-DP</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.playoffs.wins ?? 0}
                                  -
                                  {statsTotals.playoffs.losses ?? 0}
                                  -
                                  {statsTotals.playoffs.otLosses ?? 0}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">BL</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.playoffs.shutouts ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">%ARR</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.playoffs.savePctg ? `${(statsTotals.playoffs.savePctg ).toFixed(3)}` : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">MOY</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.playoffs.goalsAgainstAvg ? statsTotals.playoffs.goalsAgainstAvg.toFixed(2) : '-'}
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PJ</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.playoffs.gamesPlayed}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">B</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.playoffs.goals ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">P</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.playoffs.assists ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PTS</p>
                                <p className="text-base sm:text-xl font-bold">{statsTotals.playoffs.points ?? 0}</p>
                              </div>
                              <div>
                                <p className="text-xs sm:text-sm font-medium">PPM</p>
                                <p className="text-base sm:text-xl font-bold">
                                  {statsTotals.playoffs.gamesPlayed
                                    ? ((statsTotals.playoffs.points ?? 0) / statsTotals.playoffs.gamesPlayed).toFixed(2)
                                    : '0.00'}
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
                        <TableHead className="whitespace-nowrap px-2 sm:px-4">Saison</TableHead>
                        <TableHead className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">Ligue</TableHead>
                        <TableHead className="w-full px-2 sm:px-4">Équipe</TableHead>
                        <TableHead className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">Type</TableHead>
                        {player.position === 'G' ? (
                          <>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">PJ</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">V</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">D</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">DP</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">BL</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">%ARR</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">MOY</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">PJ</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">B</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">P</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4">PTS</TableHead>
                            <TableHead className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">PPM</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(player.seasonTotals ?? [])
                        .sort((a, b) => {
                          const seasonDiff = (b.season ?? 0) - (a.season ?? 0);
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
                            <TableCell className="whitespace-nowrap px-2 sm:px-4">
                              <span className="sm:hidden">{formatSeasonShort(season.season)}</span>
                              <span className="hidden sm:inline">{formatSeason(season.season)}</span>
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">{season.leagueAbbrev}</TableCell>
                            <TableCell className="max-w-0 px-2 sm:px-4 break-words">{season.teamName?.default ?? '-'}</TableCell>
                            <TableCell className="px-2 sm:px-4 hidden sm:table-cell">
                              <Badge variant={season.gameTypeId === 3 ? 'destructive' : 'default'}>
                                {season.gameTypeId === 3 ? 'Séries' : 'Régulière'}
                              </Badge>
                            </TableCell>
                            {player.position === 'G' ? (
                              <>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">{season.gamesPlayed || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">{season.wins || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">{season.losses || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">{season.otLosses || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">{season.shutouts || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">
                                  {season.savePctg ? `${(season.savePctg).toFixed(3)}` : '-'}
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">
                                  {season.goalsAgainstAvg ? season.goalsAgainstAvg.toFixed(2) : '-'}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">{season.gamesPlayed || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">{season.goals || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">{season.assists || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4">{season.points || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap px-2 sm:px-4 hidden sm:table-cell">
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
