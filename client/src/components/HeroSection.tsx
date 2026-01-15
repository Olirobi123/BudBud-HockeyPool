import {
  Trophy, Users, TrendingUp, Zap,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useActiveTeams } from '@/hooks/useActiveTeams';
import { usePageLoading } from '@/hooks/usePageLoading';

export default function HeroSection() {
  const { data: equipesActives = [], isLoading } = useActiveTeams();

  // Gestion automatique du loading de la page
  usePageLoading({ dependencies: [isLoading] });

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),transparent)] opacity-10" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-slate-50 shadow-xl shadow-primary/10 ring-1 ring-slate-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center opacity-5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="animate-slide-up">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-success text-sm font-medium">En direct - Saison 2024-25</span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Pool de Hockey
                {' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  38BudBud
                </span>
              </h1>

              <p className="mt-6 text-xl text-white/90 leading-relaxed max-w-2xl">
                Plateforme modernisée pour votre pool de hockey avec suivi en temps réel,
                statistiques avancées et interface intuitive pour une expérience de jeu optimale.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-bold"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Voir le Classement
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-slate-800/50 text-white border-slate-700 hover:bg-slate-800 hover:text-white backdrop-blur-sm transition-all duration-200"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Statistiques
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 mt-12 lg:mt-0">
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <Card className="bg-blue-500/10 border-blue-400/20 backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">{equipesActives.length || 0}</div>
                  <div className="text-sm text-blue-200">Équipes Actives</div>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/10 border-blue-400/20 backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">84</div>
                  <div className="text-sm text-blue-200">Échanges Total</div>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/10 border-blue-400/20 backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300 col-span-2">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white">En cours</div>
                  <div className="text-sm text-blue-200">Saison 2024-25 - Mise à jour quotidienne</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
