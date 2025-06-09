import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import EchangeForm from "@/components/forms/echange-form";
import { Echange } from "../components/interfaces/IEchange.ts";


// Fonction pour récupérer les échanges depuis l'API
const fetchEchanges = async (): Promise<Echange[]> => {
  const response = await fetch('/api/echanges');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des échanges');
  }
  return response.json();
};

// Fonction pour formater la date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Fonction pour obtenir le badge de statut
const getStatusBadge = (statut_confirmer: boolean) => {
  if (statut_confirmer) {
      return <Badge className="bg-green-500 text-white">Complété</Badge>;
  }else{
      return <Badge className="bg-yellow-500 text-white">En Attente</Badge>;    
  }
};

export default function Echanges() {
  const { data: echanges, isLoading, error } = useQuery<Echange[]>({
    queryKey: ['echanges'],
    queryFn: fetchEchanges
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {(error as Error).message}</div>;
  if (!echanges || echanges.length === 0) return <div>Aucun échange trouvé</div>;

  // Grouper les échanges par mois
  const echangesParMois = echanges.reduce((acc, echange) => {
    const mois = echange.date.substring(0, 7); // Format: YYYY-MM
    if (!acc[mois]) acc[mois] = [];
    acc[mois].push(echange);
    return acc;
  }, {} as Record<string, Echange[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des Échanges</h1>
            <p className="text-gray-600">Tous les échanges de la ligue</p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <ArrowLeftRight className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{echanges.length}</div>
                <div className="text-sm text-gray-600">Échanges Total</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {echanges.filter(e => e.statut_confirmer === false).length}
                </div>
                <div className="text-sm text-gray-600">En Attente</div>
              </CardContent>
            </Card>
          </div>

          {/* Add Trade Button */}
          <div className="mb-6">
            <EchangeForm />
          </div>

          {/* Trades List */}
          <div className="space-y-8">
            {Object.entries(echangesParMois).map(([mois, echangesDuMois]) => (
              <div key={mois}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {new Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: 'long' })
                    .format(new Date(mois + '-01'))}
                </h2>
                
                <div className="space-y-4">
                  {echangesDuMois.map((echange) => (
                    <Card key={echange.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {formatDate(echange.date)}
                            </span>
                          </div>
                          {getStatusBadge(echange.statut_confirmer)}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">{echange.equipe_source_nom}</h3>
                          </div>
                          
                          <div className="text-center">
                            <ArrowLeftRight className="w-6 h-6 text-gray-400 mx-auto" />
                          </div>
                          
                          <div className="text-center">
                            <h3 className="font-semibold text-gray-900 mb-2">{echange.equipe_destination_nom}</h3>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-sm text-blue-700 space-y-1">
                                  {echange.details.split('|')[0]?.trim().split(',').map((item, index) => (
                                    <p key={index} className="whitespace-pre-wrap">
                                      {item.replace(/^.*?reçoit:?\s*/i, '').trim()}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-center">
                              <span className="text-gray-400">↔</span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="bg-red-50 p-3 rounded-lg">
                                <div className="text-sm text-red-700 space-y-1">
                                 {echange.details.split('|')[1]?.trim().split(',').map((item, index) => (
                                    <p key={index} className="whitespace-pre-wrap">
                                      {item.replace(/^.*?reçoit:?\s*/i, '').trim()}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}