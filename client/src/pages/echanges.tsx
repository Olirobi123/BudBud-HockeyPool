import { useEchanges } from '@/hooks/echanges/useEchanges';
import { EchangeStats } from '@/components/echanges/EchangeStats';
import { EchangeList } from '@/components/echanges/EchangeList';
import EchangeForm from '@/components/forms/EchangeForm';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Loading from '@/components/ui/loading';
import { useLoading } from '@/lib/loading-context';
import { useEffect, useRef } from 'react';

export default function Echanges() {
  const { setPageLoading } = useLoading();
  const hasLoaded = useRef(false);
  const {
    data: echanges,
    isLoading,
    error,
  } = useEchanges();

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

  if (error) {
    return (
      <div>
        Erreur:
        {(error as Error).message}
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
