import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, Trophy, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { useLoading } from "@/lib/loading-context";
import { useEffect, useRef } from "react";
import Loading from "@/components/ui/loading";

interface DraftPick {
  annee: number;
  type_id: number;
  rang: number;
  round: number;
  nom: string;
  joueur: string;
}

// Fonction pour récupérer les choix de repêchage
const fetchDraftPicks = async (): Promise<DraftPick[]> => {
  const response = await fetch('/api/repechage');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des choix de repêchage');
  }
  return response.json();
};

export default function Draft() {
  const { setPageLoading } = useLoading();
  const hasLoaded = useRef(false);
  
  const { 
    data: draftPicks, 
    isLoading,
    error 
  } = useQuery<DraftPick[]>({
    queryKey: ['draftPicks'],
    queryFn: fetchDraftPicks
  });

  useEffect(() => {
    if (!isLoading && !hasLoaded.current) {
      hasLoaded.current = true;
      setPageLoading(false);
    }
  }, [isLoading, setPageLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) return <div>Erreur: {(error as Error).message}</div>;
  if (!draftPicks || draftPicks.length === 0) return <div>Aucun choix de repêchage trouvé</div>;

  // Récupérer l'année la plus récente
  const currentYear = Math.max(...draftPicks.map(pick => pick.annee));
  
  // Filtrer les choix pour l'année en cours
  const currentYearPicks = draftPicks.filter(pick => pick.annee === currentYear);
  
  // Calculer les statistiques du repêchage
  const draftInfo = {
    status: "completed",
    date: "2024-09-15",
    time: "19:00",
    totalRounds: Math.max(...currentYearPicks.map(pick => pick.round)),
    totalPicks: currentYearPicks.length,
    currentRound: Math.max(...currentYearPicks.map(pick => pick.round)),
    currentPick: currentYearPicks.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Repêchage {currentYear}</h1>
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
              <CardTitle>Première Ronde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Choix</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Équipe</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Joueur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentYearPicks
                      .filter(pick => pick.round === 1)
                      .map((pick) => (
                        <tr key={pick.rang} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-bold">
                                {pick.round}.{pick.rang}
                              </Badge>
                              {pick.rang <= 3 && (
                                <Star className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 font-medium text-gray-900">{pick.nom}</td>
                          <td className="py-3 px-2 font-semibold text-blue-600">{pick.joueur}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
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
                  Le repêchage pour la saison {currentYear + 1} aura lieu en septembre {currentYear}.
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