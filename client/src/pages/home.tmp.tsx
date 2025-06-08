import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Trophy, Users, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";

interface Echange {
  id: number;
  date: string;
  equipe_source_id: number;
  equipe_destination_id: number;
  equipe_source_nom: string;
  equipe_destination_nom: string;
  details: string;
  statut_confirmer: boolean;
}

// Fonction pour récupérer les échanges depuis l'API
const fetchEchanges = async (): Promise<Echange[]> => {
  const response = await fetch('/api/echanges');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des échanges');
  }
  return response.json();
};

export default function Home() {
  const { data: echanges, isLoading, error } = useQuery<Echange[]>({
    queryKey: ['echanges'],
    queryFn: fetchEchanges
  });

  const latestEchange = echanges?.[0];
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) return `Il y a ${diffMinutes} minutes`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)} heures`;
    return `Il y a ${Math.floor(diffMinutes / 1440)} jours`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <HeroSection />
        
        {/* Live Feed Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Live Activity Feed */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Activité en Direct</h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 font-medium">En direct</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {echanges?.slice(0, 4).map((echange) => (
                    <Card key={echange.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="default">Échange</Badge>
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(echange.date)}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900 mb-1">
                              Échange entre {echange.equipe_source_nom} et {echange.equipe_destination_nom}
                            </p>
                            <div className="text-sm text-gray-600 space-y-1">
                              {echange.details.split('|')[0]?.trim().split('\n')
                                .filter(item => item.trim())
                                .map((item, index) => (
                                  <p key={index} className="text-blue-700">
                                    {item.replace(/^[^reçoit]*reçoit:?\s*/i, '').trim()}
                                  </p>
                                ))}
                              <p className="text-gray-400 text-center my-1">↔</p>
                              {echange.details.split('|')[1]?.trim().split('\n')
                                .filter(item => item.trim())
                                .map((item, index) => (
                                  <p key={index} className="text-red-700">
                                    {item.replace(/^[^reçoit]*reçoit:?\s*/i, '').trim()}
                                  </p>
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              {/* Latest Trade Sidebar */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Dernier Échange</h3>
                {latestEchange && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Échange Récent</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{formatTimeAgo(latestEchange.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-900 mb-2">{latestEchange.equipe_source_nom}</h4>
                          <div className="space-y-1">
                            {latestEchange.details.split('|')[0]?.trim().split('\n')
                              .filter(item => item.trim())
                              .map((item, index) => (
                                <div key={index} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  {item.replace(/^[^reçoit]*reçoit:?\s*/i, '').trim()}
                                </div>
                              ))}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-gray-400 font-bold">↕</div>
                        </div>
                        
                        <div className="text-center">
                          <h4 className="font-semibold text-gray-900 mb-2">{latestEchange.equipe_destination_nom}</h4>
                          <div className="space-y-1">
                            {latestEchange.details.split('|')[1]?.trim().split('\n')
                              .filter(item => item.trim())
                              .map((item, index) => (
                                <div key={index} className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded">
                                  {item.replace(/^[^reçoit]*reçoit:?\s*/i, '').trim()}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      
                      <Link href="/echanges">
                        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
                          Voir tous les Échanges
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions Rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/equipes">
                      <Button variant="outline" className="w-full justify-start">
                        <Trophy className="w-4 h-4 mr-2" />
                        Voir Classement
                      </Button>
                    </Link>
                    
                    <Link href="/draft">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Repêchage 2024-25
                      </Button>
                    </Link>
                    
                    <a 
                      href="https://www.marqueur.com/hockey/mbr/tools/pool/index.php?nyx=190707"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full justify-start">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Statistiques Marqueur
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
