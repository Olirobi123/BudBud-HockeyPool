import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import JoueurSkeleton from '@/components/joueur/JoueurSkeleton';
import JoueurLayout from '@/components/joueur/JoueurLayout';
import { usePlayerDetails } from '@/hooks/usePlayerDetails';
import { ErrorDisplay } from '@/components/ui/error-display';
import NotFound from './not-found';

export default function Joueur() {
  const { id } = useParams();

  const {
    data: player,
    isLoading,
    error,
  } = usePlayerDetails(id || '');

  if (isLoading) {
    return <JoueurSkeleton />;
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      </Layout>
    );
  }

  if (!player) {
    return <NotFound />;
  }

  return (
    <JoueurLayout player={player} />
  );
}
