import { useRoute } from 'wouter';
import Loading from '@/components/ui/loading';
import JoueurLayout from '@/components/joueur/JoueurLayout';
import { usePlayerDetails } from '@/hooks/usePlayerDetails';
import { ErrorDisplay } from '@/components/ui/error-display';
import { usePageLoading } from '@/hooks/usePageLoading';

export default function Joueur() {
  const [, params] = useRoute('/joueur/:id');
  const playerId = params?.id;

  const {
    data: player,
    isLoading,
    error,
  } = usePlayerDetails(playerId || '');

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
  if (!player) return <div>Joueur non trouvé</div>;

  return (
    <JoueurLayout player={player} />
  );
}
