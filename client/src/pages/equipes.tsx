import { Users } from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Loading from '@/components/ui/loading';
import { useTeams } from '@/hooks/useTeams';
import { useActiveTeams } from '@/hooks/useActiveTeams';
import Equipe from '@/types/IEquipes';
import { ErrorDisplay } from '@/components/ui/error-display';
import { usePageLoading } from '@/hooks/usePageLoading';

export default function Equipes() {
  const {
    data: equipes,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useTeams();

  const {
    data: equipesActives,
    isLoading: isLoadingActives,
  } = useActiveTeams();

  // Gestion automatique du loading de la page
  usePageLoading({ dependencies: [isLoadingAll, isLoadingActives] });

  if (isLoadingAll || isLoadingActives) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (errorAll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorDisplay error={errorAll} onRetry={() => window.location.reload()} />
      </div>
    );
  }
  if (!equipes) return <div>Aucune équipe trouvée</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Liste des Équipes</h1>
            <p className="text-gray-600">Saison 2024-25</p>
          </div>

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{equipesActives?.length || 0}</div>
                <div className="text-sm text-gray-600">Équipes Actives</div>
              </CardContent>
            </Card>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipes.map((equipe) => (
              <Card key={equipe.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {equipe.nom}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Statut</span>
                      <Badge
                        variant="secondary"
                        className={equipe.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {equipe.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <a href={`/equipes/${equipe.id}`}>
                      <Button
                        size="sm"
                        className="w-full mt-4 bg-transparent border border-gray-200 text-gray-900 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-cyan-400 hover:text-slate-900 hover:border-transparent hover:font-bold"
                      >
                        Voir les Détails
                      </Button>
                    </a>
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
