import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import PlayerDetails from '@/types/IPlayerDetails';
import { formatSeason } from '@/lib/utils';


type Props = {
  player: PlayerDetails;
};


export default function JoueurTabsOverview({ player }: Props) {
  const subSeason = player.featuredStats?.regularSeason?.subSeason;

  return (
    <TabsContent value="apercu">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date de naissance</p>
              <p className="font-medium">
                {player.birthDate ? format(new Date(player.birthDate), 'd MMMM yyyy', { locale: fr }) : '-'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lieu de naissance</p>
              <p className="font-medium">
                {player.birthCity?.default ?? '-'}
                {player.birthStateProvince?.default ? `, ${player.birthStateProvince.default}` : ''}
                {player.birthCountry ? `, ${player.birthCountry}` : ''}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille</p>
                <p className="font-medium">
                  {player.heightInCentimeters ?? '-'}
                  {' '}
                  cm
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Poids</p>
                <p className="font-medium">
                  {player.weightInKilograms ?? '-'}
                  {' '}
                  kg
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tire/Attrape</p>
              <p className="font-medium">{player.shootsCatches ?? '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Repêchage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {player.draftDetails ? (
              <>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Année</p>
                  <p className="font-medium">{player.draftDetails.year ?? '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">
                    {player.draftDetails.round ?? '-'}
                    e ronde,
                    {player.draftDetails.overallPick ?? '-'}
                    e au total
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Équipe</p>
                  <p className="font-medium">{player.draftDetails.teamAbbrev ?? '-'}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Non repêché</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Statistiques
              {' '}
              {formatSeason(player.featuredStats?.season)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subSeason ? (
              <div className="grid grid-cols-2 gap-4">
                {player.position === 'G' ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Parties jouées</p>
                      <p className="font-medium">{subSeason.gamesPlayed ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Victoires</p>
                      <p className="font-medium">{subSeason.wins ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Jeux blancs</p>
                      <p className="font-medium">{subSeason.shutouts ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">% d'arrêts</p>
                      <p className="font-medium">
                        {((subSeason.savePctg ?? 0)).toFixed(3)}
                        
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Moyenne de buts</p>
                      <p className="font-medium">
                        {(subSeason.goalsAgainstAvg ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Fiche</p>
                      <p className="font-medium">
                        {subSeason.wins ?? 0}
                        -
                        {subSeason.losses ?? 0}
                        -
                        {subSeason.otLosses ?? 0}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Matchs</p>
                      <p className="font-medium">{subSeason.gamesPlayed ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="font-medium">{subSeason.points ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Buts</p>
                      <p className="font-medium">{subSeason.goals ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Passes</p>
                      <p className="font-medium">{subSeason.assists ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">+/-</p>
                      <p className="font-medium">{subSeason.plusMinus ?? 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">PPM</p>
                      <p className="font-medium">
                        {subSeason.gamesPlayed
                          ? ((subSeason.points ?? 0) / subSeason.gamesPlayed).toFixed(2)
                          : '0.00'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
            // Afficher les dernières statistiques disponibles
              (() => {
                const lastStats = (player.seasonTotals ?? [])
                  .filter((s) => s.leagueAbbrev === 'NHL' || s.leagueAbbrev === 'NCAA')
                  .sort((a, b) => (b.season ?? 0) - (a.season ?? 0))[0];

                if (lastStats) {
                  return (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Dernières statistiques (
                        {formatSeason(lastStats.season)}
                        {' '}
                        -
                        {' '}
                        {lastStats.leagueAbbrev}
                        )
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {player.position === 'G' ? (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Parties jouées</p>
                              <p className="font-medium">{lastStats.gamesPlayed ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Victoires</p>
                              <p className="font-medium">{lastStats.wins ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Jeux blancs</p>
                              <p className="font-medium">{lastStats.shutouts ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">% d'arrêts</p>
                              <p className="font-medium">
                                {lastStats.savePctg ? `${(lastStats.savePctg).toFixed(3)}` : '-'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Moyenne de buts</p>
                              <p className="font-medium">
                                {lastStats.goalsAgainstAvg ? lastStats.goalsAgainstAvg.toFixed(2) : '-'}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Fiche</p>
                              <p className="font-medium">
                                {lastStats.wins ?? 0}
                                -
                                {lastStats.losses ?? 0}
                                -
                                {lastStats.otLosses ?? 0}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Matchs</p>
                              <p className="font-medium">{lastStats.gamesPlayed ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Points</p>
                              <p className="font-medium">{lastStats.points ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Buts</p>
                              <p className="font-medium">{lastStats.goals ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Passes</p>
                              <p className="font-medium">{lastStats.assists ?? 0}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">PPM</p>
                              <p className="font-medium">
                                {lastStats.gamesPlayed
                                  ? ((lastStats.points ?? 0) / lastStats.gamesPlayed).toFixed(2)
                                  : '0.00'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <p className="text-muted-foreground">Aucune statistique NHL/NCAA disponible</p>
                );
              })()
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
