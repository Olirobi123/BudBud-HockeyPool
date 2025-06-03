import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Users, TrendingUp, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// Mock data for teams - in a real app, this would come from your backend
const teams = [
  { id: 1, name: "Les Canadiens", owner: "Marc Dubois", points: 245, rank: 1, players: 23, trend: "up" },
  { id: 2, name: "Nordiques Forever", owner: "Julie Tremblay", points: 238, rank: 2, players: 23, trend: "up" },
  { id: 3, name: "Bruins Power", owner: "Pierre Laval", points: 232, rank: 3, players: 22, trend: "down" },
  { id: 4, name: "Rangers Elite", owner: "Sophie Martin", points: 228, rank: 4, players: 23, trend: "same" },
  { id: 5, name: "Leafs Nation", owner: "Michel Côté", points: 225, rank: 5, players: 23, trend: "up" },
  { id: 6, name: "Flames Squad", owner: "Annie Bouchard", points: 220, rank: 6, players: 22, trend: "down" },
  { id: 7, name: "Oilers Dynasty", owner: "Robert Roy", points: 215, rank: 7, players: 23, trend: "same" },
  { id: 8, name: "Lightning Strike", owner: "Marie Gagnon", points: 210, rank: 8, players: 22, trend: "up" },
  { id: 9, name: "Penguins Power", owner: "Jean Bélanger", points: 205, rank: 9, players: 23, trend: "down" },
  { id: 10, name: "Capitals Force", owner: "Sylvie Leblanc", points: 198, rank: 10, players: 22, trend: "same" },
  { id: 11, name: "Avalanche Rush", owner: "Daniel Fortin", points: 192, rank: 11, players: 23, trend: "up" },
  { id: 12, name: "Stars Align", owner: "Caroline Morin", points: 185, rank: 12, players: 22, trend: "down" },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <TrendingUp className="w-4 h-4 text-green-500" />;
    case "down": return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
  }
};

const getRankBadgeColor = (rank: number) => {
  if (rank === 1) return "bg-yellow-500 text-yellow-900";
  if (rank <= 3) return "bg-gray-400 text-gray-900";
  if (rank <= 6) return "bg-blue-500 text-blue-900";
  return "bg-slate-500 text-slate-900";
};

export default function Equipes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Classement des Équipes</h1>
            <p className="text-gray-600">Saison 2024-25 - Mise à jour quotidienne</p>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{teams.length}</div>
                <div className="text-sm text-gray-600">Équipes Actives</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{teams[0].points}</div>
                <div className="text-sm text-gray-600">Points en Tête</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">23</div>
                <div className="text-sm text-gray-600">Joueurs par Équipe</div>
              </CardContent>
            </Card>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className={`${getRankBadgeColor(team.rank)} text-white font-bold`}
                    >
                      #{team.rank}
                    </Badge>
                    {getTrendIcon(team.trend)}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {team.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">Propriétaire: {team.owner}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Points</span>
                      <span className="text-lg font-bold text-primary">{team.points}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Joueurs</span>
                      <span className="text-sm font-medium">{team.players}/23</span>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 hover:bg-primary hover:text-white"
                    >
                      Voir l'Équipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}