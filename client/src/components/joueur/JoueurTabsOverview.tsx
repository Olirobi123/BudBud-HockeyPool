import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  player: PlayerDetails;
};

export default function JoueurTabsOverview({ player }: Props) {
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
                {format(new Date(player.birthDate), 'd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lieu de naissance</p>
              <p className="font-medium">
                {player.birthCity.default}
                {player.birthStateProvince?.default ? `, ${player.birthStateProvince.default}` : ''}
                {`, ${player.birthCountry}`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Taille</p>
                <p className="font-medium">
                  {player.heightInCentimeters}
                  {' '}
                  cm
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Poids</p>
                <p className="font-medium">
                  {player.weightInKilograms}
                  {' '}
                  kg
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tire/Attrape</p>
              <p className="font-medium">{player.shootsCatches}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Repêchage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Année</p>
              <p className="font-medium">{player.draftDetails.year}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">
                {player.draftDetails.round}
                e ronde,
                {player.draftDetails.overallPick}
                e au total
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Équipe</p>
              <p className="font-medium">{player.draftDetails.teamAbbrev}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Statistiques
              {new Date().getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {player.featuredStats ? (
              <div className="grid grid-cols-2 gap-4">
                {player.position === 'G' ? (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Parties jouées</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.gamesPlayed}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Victoires</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.wins}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Jeux blancs</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.shutouts}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">% d'arrêts</p>
                      <p className="font-medium">
                        {((player.featuredStats.regularSeason.subSeason.savePctg ?? 0) * 100).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Moyenne de buts</p>
                      <p className="font-medium">
                        {(player.featuredStats.regularSeason.subSeason.goalsAgainstAvg ?? 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Fiche</p>
                      <p className="font-medium">
                        {player.featuredStats.regularSeason.subSeason.wins}
                        -
                        {player.featuredStats.regularSeason.subSeason.losses}
                        -
                        {player.featuredStats.regularSeason.subSeason.otLosses}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Matchs</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.gamesPlayed}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.points}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Buts</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.goals}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Passes</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.assists}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">+/-</p>
                      <p className="font-medium">{player.featuredStats.regularSeason.subSeason.plusMinus}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">PPM</p>
                      <p className="font-medium">
                        {(player.featuredStats.regularSeason.subSeason.points
                                  / player.featuredStats.regularSeason.subSeason.gamesPlayed).toFixed(2)}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ) : (
            // Afficher les dernières statistiques disponibles
              (() => {
                const lastStats = player.seasonTotals
                  .filter((s) => s.leagueAbbrev === 'NHL' || s.leagueAbbrev === 'NCAA')
                  .sort((a, b) => b.season - a.season)[0];

                if (lastStats) {
                  return (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Dernières statistiques (
                        {lastStats.season}
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
                              <p className="font-medium">{lastStats.gamesPlayed}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Victoires</p>
                              <p className="font-medium">{lastStats.wins}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Jeux blancs</p>
                              <p className="font-medium">{lastStats.shutouts}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">% d'arrêts</p>
                              <p className="font-medium">
                                {lastStats.savePctg ? `${(lastStats.savePctg * 100).toFixed(1)}%` : '-'}
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
                                {lastStats.wins}
                                -
                                {lastStats.losses}
                                -
                                {lastStats.otLosses || 0}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Matchs</p>
                              <p className="font-medium">{lastStats.gamesPlayed}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Points</p>
                              <p className="font-medium">{lastStats.points}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Buts</p>
                              <p className="font-medium">{lastStats.goals}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Passes</p>
                              <p className="font-medium">{lastStats.assists}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">PPM</p>
                              <p className="font-medium">
                                {(lastStats.points / lastStats.gamesPlayed).toFixed(2)}
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
