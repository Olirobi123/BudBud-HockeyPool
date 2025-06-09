import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PlayerDetails {
  playerId: number;
  isActive: boolean;
  currentTeamId: number;
  currentTeamAbbrev: string;
  fullTeamName: { default: string; fr: string };
  firstName: { default: string };
  lastName: { default: string };
  sweaterNumber: number;
  position: string;
  headshot: string;
  heroImage: string;
  teamLogo: string;
  heightInInches: number;
  heightInCentimeters: number;
  weightInPounds: number;
  weightInKilograms: number;
  birthDate: string;
  birthCity: { default: string };
  birthStateProvince: { default: string };
  birthCountry: string;
  shootsCatches: string;
  draftDetails: {
    year: number;
    teamAbbrev: string;
    round: number;
    pickInRound: number;
    overallPick: number;
  };
  featuredStats?: {
    season: number;
    regularSeason: {
      subSeason: {
        assists: number;
        goals: number;
        points: number;
        gamesPlayed: number;
        plusMinus: number;
        powerPlayGoals: number;
        powerPlayPoints: number;
        shots: number;
        // Stats de gardien
        wins?: number;
        losses?: number;
        otLosses?: number;
        shutouts?: number;
        savePctg?: number;
        goalsAgainstAvg?: number;
      };
    };
  };
  last5Games?: Array<{
    gameDate: string;
    goals: number;
    assists: number;
    points: number;
    plusMinus: number;
    shots: number;
    opponentAbbrev: string;
    homeRoadFlag: string;
    toi: string;
    // Stats de gardien
    decision?: string;
    gamesStarted?: number;
    goalsAgainst?: number;
    penaltyMins?: number;
    savePctg?: number;
    shotsAgainst?: number;
  }>;
  seasonTotals: Array<{
    assists: number;
    goals: number;
    points: number;
    gamesPlayed: number;
    leagueAbbrev: string;
    season: number;
    teamName: {
      default: string;
    };
    gameTypeId?: number;
    // Stats de gardien
    wins?: number;
    losses?: number;
    otLosses?: number;
    shutouts?: number;
    savePctg?: number;
    goalsAgainstAvg?: number;
    timeOnIce?: string;
  }>;
}

const fetchPlayerDetails = async (playerId: string): Promise<PlayerDetails> => {
  const response = await fetch(`/api/players/${playerId}`);
  if (!response.ok) {
    console.log(response);
    throw new Error('Erreur lors de la récupération des détails du joueur');
  }
  return response.json();
};

export default function Joueur() {
  const [, params] = useRoute("/joueur/:id");
  const playerId = params?.id;

  const { data: player, isLoading, error } = useQuery<PlayerDetails>({
    queryKey: ['player', playerId],
    queryFn: () => fetchPlayerDetails(playerId || ''),
    enabled: !!playerId,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {(error as Error).message}</div>;
  if (!player) return <div>Joueur non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête avec image de héros */}
          <div className="relative h-64 rounded-xl overflow-hidden mb-8">
            <img 
              src={player.heroImage} 
              alt={`${player.firstName.default} ${player.lastName.default}`}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end space-x-4">
              <Avatar className="w-24 h-24 border-4 border-white">
                <img src={player.headshot} alt={`${player.firstName.default} ${player.lastName.default}`} />
              </Avatar>
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  {player.firstName.default} {player.lastName.default}
                </h1>
                <div className="flex items-center space-x-3">
                  <img src={player.teamLogo} alt={player.fullTeamName.fr} className="h-8" />
                  <Badge variant="outline" className="text-white border-white">
                    #{player.sweaterNumber}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white">
                    {player.position}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="apercu" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
              <TabsTrigger value="derniers-matchs">5 derniers matchs</TabsTrigger>
            </TabsList>

            <TabsContent value="apercu">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations Personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Date de naissance</p>
                      <p className="font-medium">
                        {format(new Date(player.birthDate), "d MMMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Lieu de naissance</p>
                      <p className="font-medium">
                        {player.birthCity.default}
                        {player.birthStateProvince?.default ? `, ${player.birthStateProvince.default}` : ''}
                        {`, ${player.birthCountry}`}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Taille</p>
                        <p className="font-medium">{player.heightInCentimeters} cm</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Poids</p>
                        <p className="font-medium">{player.weightInKilograms} kg</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Tire/Attrape</p>
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
                      <p className="text-sm text-gray-500">Année</p>
                      <p className="font-medium">{player.draftDetails.year}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium">
                        {player.draftDetails.round}e ronde, {player.draftDetails.overallPick}e au total
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Équipe</p>
                      <p className="font-medium">{player.draftDetails.teamAbbrev}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistiques {new Date().getFullYear()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {player.featuredStats ? (
                      <div className="grid grid-cols-2 gap-4">
                        {player.position === 'G' ? (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Parties jouées</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.gamesPlayed}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Victoires</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.wins}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Jeux blancs</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.shutouts}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">% d'arrêts</p>
                              <p className="font-medium">
                                {(player.featuredStats.regularSeason.subSeason.savePctg * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Moyenne de buts</p>
                              <p className="font-medium">
                                {player.featuredStats.regularSeason.subSeason.goalsAgainstAvg.toFixed(2)}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm text-gray-500 mb-1">Fiche</p>
                              <p className="font-medium">
                                {player.featuredStats.regularSeason.subSeason.wins}-
                                {player.featuredStats.regularSeason.subSeason.losses}-
                                {player.featuredStats.regularSeason.subSeason.otLosses}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Matchs</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.gamesPlayed}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Points</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.points}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Buts</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.goals}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Passes</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.assists}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">+/-</p>
                              <p className="font-medium">{player.featuredStats.regularSeason.subSeason.plusMinus}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">PPM</p>
                              <p className="font-medium">
                                {(player.featuredStats.regularSeason.subSeason.points / 
                                  player.featuredStats.regularSeason.subSeason.gamesPlayed).toFixed(2)}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      // Afficher les dernières statistiques disponibles
                      (() => {
                        const lastStats = player.seasonTotals
                          .filter(s => s.leagueAbbrev === 'NHL' || s.leagueAbbrev === 'NCAA')
                          .sort((a, b) => b.season - a.season)[0];
                        
                        if (lastStats) {
                          return (
                            <div className="space-y-4">
                              <div className="text-sm text-gray-500">
                                Dernières statistiques ({lastStats.season} - {lastStats.leagueAbbrev})
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {player.position === 'G' ? (
                                  <>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Parties jouées</p>
                                      <p className="font-medium">{lastStats.gamesPlayed}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Victoires</p>
                                      <p className="font-medium">{lastStats.wins}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Jeux blancs</p>
                                      <p className="font-medium">{lastStats.shutouts}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">% d'arrêts</p>
                                      <p className="font-medium">
                                        {lastStats.savePctg ? (lastStats.savePctg * 100).toFixed(1) + '%' : '-'}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Moyenne de buts</p>
                                      <p className="font-medium">
                                        {lastStats.goalsAgainstAvg ? lastStats.goalsAgainstAvg.toFixed(2) : '-'}
                                      </p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-sm text-gray-500 mb-1">Fiche</p>
                                      <p className="font-medium">
                                        {lastStats.wins}-{lastStats.losses}-{lastStats.otLosses || 0}
                                      </p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Matchs</p>
                                      <p className="font-medium">{lastStats.gamesPlayed}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Points</p>
                                      <p className="font-medium">{lastStats.points}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Buts</p>
                                      <p className="font-medium">{lastStats.goals}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">Passes</p>
                                      <p className="font-medium">{lastStats.assists}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-gray-500">PPM</p>
                                      <p className="font-medium">
                                        {(lastStats.points / lastStats.gamesPlayed).toFixed(2)}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <p className="text-gray-500">Aucune statistique NHL/NCAA disponible</p>
                          );
                        }
                      })()
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

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
                            <TableCell>{format(new Date(game.gameDate), "d MMM", { locale: fr })}</TableCell>
                            <TableCell>
                              {game.homeRoadFlag === 'H' ? 'vs' : '@'} {game.opponentAbbrev}
                            </TableCell>
                            {player.position === 'G' ? (
                              <>
                                <TableCell>{game.decision || '-'}</TableCell>
                                <TableCell>{game.goalsAgainst}</TableCell>
                                <TableCell>{game.shotsAgainst}</TableCell>
                                <TableCell>{game.savePctg ? (game.savePctg * 100).toFixed(1) + '%' : '-'}</TableCell>
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
                      <p className="text-gray-500">Aucun match NHL disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

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
                                    ? ((acc[key].savePctg * acc[key].gamesPlayed + (curr.savePctg || 0) * (curr.gamesPlayed || 0)) / 
                                       (acc[key].gamesPlayed + (curr.gamesPlayed || 0)))
                                    : curr.savePctg,
                                  goalsAgainstAvg: acc[key]?.goalsAgainstAvg
                                    ? ((acc[key].goalsAgainstAvg * acc[key].gamesPlayed + (curr.goalsAgainstAvg || 0) * (curr.gamesPlayed || 0)) / 
                                       (acc[key].gamesPlayed + (curr.gamesPlayed || 0)))
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
                                    <Card className="bg-primary/5">
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
                                                  {statsTotals.regular.wins}-{statsTotals.regular.losses}-{statsTotals.regular.otLosses}
                                                </p>
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium">BL</p>
                                                <p className="text-xl font-bold">{statsTotals.regular.shutouts}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium">%ARR</p>
                                                <p className="text-xl font-bold">
                                                  {statsTotals.regular.savePctg ? (statsTotals.regular.savePctg * 100).toFixed(1) + '%' : '-'}
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
                                    <Card className="bg-yellow-500/5">
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
                                                  {statsTotals.playoffs.wins}-{statsTotals.playoffs.losses}-{statsTotals.playoffs.otLosses}
                                                </p>
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium">BL</p>
                                                <p className="text-xl font-bold">{statsTotals.playoffs.shutouts}</p>
                                              </div>
                                              <div>
                                                <p className="text-sm font-medium">%ARR</p>
                                                <p className="text-xl font-bold">
                                                  {statsTotals.playoffs.savePctg ? (statsTotals.playoffs.savePctg * 100).toFixed(1) + '%' : '-'}
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
                                              ? 'bg-yellow-500/5'
                                              : 'bg-primary/5'
                                            : ''
                                        }
                                      >
                                        <TableCell>{season.season}</TableCell>
                                        <TableCell>{season.leagueAbbrev}</TableCell>
                                        <TableCell>{season.teamName.default}</TableCell>
                                        <TableCell>
                                          <Badge variant={season.gameTypeId === 3 ? "warning" : "default"}>
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
                                              {season.savePctg ? (season.savePctg * 100).toFixed(1) + '%' : '-'}
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
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
