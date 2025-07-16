import { useEchanges } from '@/hooks/echanges/useEchanges';
import { ErrorDisplay } from '@/components/ui/error-display';
import { EchangeStats } from '@/components/echanges/EchangeStats';
import { EchangeList } from '@/components/echanges/EchangeList';
import EchangeForm from '@/components/forms/EchangeForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Loading from '@/components/ui/loading';
import { usePageLoading } from '@/hooks/usePageLoading';

export default function Echanges() {
  const {
    data: echanges,
    isLoading,
    error,
  } = useEchanges();

  // Gestion automatique du loading de la page
  usePageLoading({ dependencies: [isLoading] });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }
  if (!echanges || echanges.length === 0) return <div>Aucun échange trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Historique des Échanges</h1>
            <p className="text-gray-600">Tous les échanges de la ligue</p>
          </div>
          <EchangeStats echanges={echanges} />
          <div className="mb-6">
            <EchangeForm />
          </div>
          <EchangeList echanges={echanges} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
