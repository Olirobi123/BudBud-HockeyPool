import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Calendar, Clock, TrendingUp } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

// Mock data for trades - in a real app, this would come from your backend
const trades = [
  {
    id: 1,
    date: "2024-12-03",
    time: "14:30",
    teamA: "Les Canadiens",
    teamB: "Nordiques Forever",
    playersA: ["Connor McDavid", "Leon Draisaitl"],
    playersB: ["Nathan MacKinnon", "Mikko Rantanen"],
    status: "completed",
    impact: "major"
  },
  {
    id: 2,
    date: "2024-12-02",
    time: "19:45",
    teamA: "Bruins Power",
    teamB: "Rangers Elite", 
    playersA: ["David Pastrnak"],
    playersB: ["Artemi Panarin", "Igor Shesterkin"],
    status: "completed",
    impact: "major"
  },
  {
    id: 3,
    date: "2024-12-01",
    time: "16:20",
    teamA: "Leafs Nation",
    teamB: "Flames Squad",
    playersA: ["Auston Matthews"],
    playersB: ["Johnny Gaudreau", "Matthew Tkachuk"],
    status: "completed",
    impact: "moderate"
  },
  {
    id: 4,
    date: "2024-11-30",
    time: "11:15",
    teamA: "Oilers Dynasty",
    teamB: "Lightning Strike",
    playersA: ["Ryan Nugent-Hopkins", "Zach Hyman"],
    playersB: ["Nikita Kucherov"],
    status: "completed",
    impact: "moderate"
  },
  {
    id: 5,
    date: "2024-11-29",
    time: "20:10",
    teamA: "Penguins Power",
    teamB: "Capitals Force",
    playersA: ["Sidney Crosby"],
    playersB: ["Alexander Ovechkin", "John Carlson"],
    status: "completed",
    impact: "major"
  },
  {
    id: 6,
    date: "2024-11-28",
    time: "13:25",
    teamA: "Avalanche Rush",
    teamB: "Stars Align",
    playersA: ["Cale Makar", "Devon Toews"],
    playersB: ["Jason Robertson", "Roope Hintz", "Jake Oettinger"],
    status: "completed",
    impact: "moderate"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500 text-white">Complété</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500 text-white">En Attente</Badge>;
    case "rejected":
      return <Badge className="bg-red-500 text-white">Rejeté</Badge>;
    default:
      return <Badge variant="secondary">Inconnu</Badge>;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "major": return "border-l-red-500";
    case "moderate": return "border-l-yellow-500";
    case "minor": return "border-l-green-500";
    default: return "border-l-gray-300";
  }
};

export default function Echanges() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Échanges de Joueurs</h1>
            <p className="text-gray-600">Historique des transactions - Saison 2024-25</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <ArrowLeftRight className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{trades.length}</div>
                <div className="text-sm text-gray-600">Échanges Total</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-sm text-gray-600">Cette Semaine</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">15</div>
                <div className="text-sm text-gray-600">Ce Mois</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-sm text-gray-600">En Attente</div>
              </CardContent>
            </Card>
          </div>

          {/* Add Trade Button */}
          <div className="mb-6">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Proposer un Échange
            </Button>
          </div>

          {/* Trades List */}
          <div className="space-y-4">
            {trades.map((trade) => (
              <Card key={trade.id} className={`border-l-4 ${getImpactColor(trade.impact)} hover:shadow-lg transition-shadow duration-300`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{trade.date}</span>
                      <Clock className="w-4 h-4 text-gray-500 ml-4" />
                      <span className="text-sm text-gray-600">{trade.time}</span>
                    </div>
                    {getStatusBadge(trade.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Team A */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">{trade.teamA}</h3>
                      <div className="space-y-1">
                        {trade.playersA.map((player, index) => (
                          <div key={index} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {player}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Exchange Arrow */}
                    <div className="text-center">
                      <ArrowLeftRight className="w-8 h-8 text-gray-400 mx-auto" />
                    </div>
                    
                    {/* Team B */}
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">{trade.teamB}</h3>
                      <div className="space-y-1">
                        {trade.playersB.map((player, index) => (
                          <div key={index} className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                            {player}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Impact:</span>
                      <Badge 
                        variant="outline" 
                        className={
                          trade.impact === "major" ? "border-red-300 text-red-700" :
                          trade.impact === "moderate" ? "border-yellow-300 text-yellow-700" :
                          "border-green-300 text-green-700"
                        }
                      >
                        {trade.impact === "major" ? "Majeur" : 
                         trade.impact === "moderate" ? "Modéré" : "Mineur"}
                      </Badge>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Voir Détails
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