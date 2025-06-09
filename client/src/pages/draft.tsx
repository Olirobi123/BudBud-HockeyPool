import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, Trophy, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useLoading } from "@/lib/loading-context";
import { useEffect } from "react";

// Mock data for draft - in a real app, this would come from your backend
const draftInfo = {
  status: "completed",
  date: "2024-09-15",
  time: "19:00",
  totalRounds: 23,
  totalPicks: 276,
  currentRound: 23,
  currentPick: 276
};

const draftPicks = [
  { round: 1, pick: 1, team: "Les Canadiens", player: "Connor McDavid", position: "C", points: 45 },
  { round: 1, pick: 2, team: "Nordiques Forever", player: "Leon Draisaitl", position: "C", points: 42 },
  { round: 1, pick: 3, team: "Bruins Power", player: "Nathan MacKinnon", position: "C", points: 41 },
  { round: 1, pick: 4, team: "Rangers Elite", player: "David Pastrnak", position: "RW", points: 38 },
  { round: 1, pick: 5, team: "Leafs Nation", player: "Nikita Kucherov", position: "RW", points: 37 },
  { round: 1, pick: 6, team: "Flames Squad", player: "Auston Matthews", position: "C", points: 36 },
  { round: 1, pick: 7, team: "Oilers Dynasty", player: "Artemi Panarin", position: "LW", points: 35 },
  { round: 1, pick: 8, team: "Lightning Strike", player: "Mikko Rantanen", position: "RW", points: 34 },
  { round: 1, pick: 9, team: "Penguins Power", player: "Erik Karlsson", position: "D", points: 33 },
  { round: 1, pick: 10, team: "Capitals Force", player: "Cale Makar", position: "D", points: 32 },
  { round: 1, pick: 11, team: "Avalanche Rush", player: "Sidney Crosby", position: "C", points: 31 },
  { round: 1, pick: 12, team: "Stars Align", player: "Alexander Ovechkin", position: "LW", points: 30 },
];

const recentPicks = [
  { round: 23, pick: 276, team: "Stars Align", player: "Kaapo Kahkonen", position: "G" },
  { round: 23, pick: 275, team: "Avalanche Rush", player: "Connor Ingram", position: "G" },
  { round: 23, pick: 274, team: "Capitals Force", player: "Joel Hofer", position: "G" },
  { round: 23, pick: 273, team: "Penguins Power", player: "Magnus Chrona", position: "G" },
  { round: 23, pick: 272, team: "Lightning Strike", player: "Dustin Wolf", position: "G" },
];

const getPositionColor = (position: string) => {
  switch (position) {
    case "C": return "bg-blue-100 text-blue-800";
    case "LW": case "RW": return "bg-green-100 text-green-800";
    case "D": return "bg-purple-100 text-purple-800";
    case "G": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function Draft() {
  const { setPageLoading } = useLoading();

  useEffect(() => {
    // Pour la page Draft, on peut désactiver le loading immédiatement
    // car elle n'a pas de données asynchrones pour le moment
    setPageLoading(false);
  }, [setPageLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Repêchage 2024-25</h1>
            <p className="text-gray-600">Ordre de sélection et historique du repêchage</p>
          </div>

          {/* Draft Status */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-blue-600" />
                <span>Statut du Repêchage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Date</span>
                  </div>
                  <p className="text-gray-700">{draftInfo.date}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Heure</span>
                  </div>
                  <p className="text-gray-700">{draftInfo.time}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Rondes</span>
                  </div>
                  <p className="text-gray-700">{draftInfo.totalRounds}</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold">Statut</span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    {draftInfo.status === "completed" ? "Terminé" : "En cours"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Round Picks */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Première Ronde - Top Sélections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Choix</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Équipe</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Joueur</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Position</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draftPicks.map((pick) => (
                      <tr key={pick.pick} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="font-bold">
                              {pick.round}.{pick.pick}
                            </Badge>
                            {pick.pick <= 3 && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-gray-900">{pick.team}</td>
                        <td className="py-3 px-2 font-semibold text-blue-600">{pick.player}</td>
                        <td className="py-3 px-2">
                          <Badge className={getPositionColor(pick.position)}>
                            {pick.position}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-bold text-green-600">{pick.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Picks */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Dernières Sélections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPicks.map((pick) => (
                  <div key={pick.pick} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className="font-bold">
                        {pick.round}.{pick.pick}
                      </Badge>
                      <span className="font-medium text-gray-900">{pick.team}</span>
                      <span className="font-semibold text-blue-600">{pick.player}</span>
                      <Badge className={getPositionColor(pick.position)}>
                        {pick.position}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Draft Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Outils de Repêchage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Ordre de Repêchage Complet
                </Button>
                <Button variant="outline" className="w-full">
                  Historique des Échanges de Choix
                </Button>
                <Button variant="outline" className="w-full">
                  Statistiques par Ronde
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Prochaine Saison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Le repêchage pour la saison 2025-26 aura lieu en septembre 2025.
                </p>
                <Button variant="outline" className="w-full">
                  S'inscrire aux Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}