import { useParams } from "react-router-dom";
import Loading from '@/components/ui/loading';
import JoueurLayout from '@/components/joueur/JoueurLayout';
import { usePlayerDetails } from '@/hooks/usePlayerDetails';
import { ErrorDisplay } from '@/components/ui/error-display';
import { usePageLoading } from '@/hooks/usePageLoading';
import NotFound from "./not-found";

export default function Joueur() {
  const { id } = useParams();
  console.log(id)

  const {
    data: player,
    isLoading,
    error,
  } = usePlayerDetails(id || '');

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
  if (!player){
    return <NotFound />;
  }

  return (
    <JoueurLayout player={player} />
  );
}
