import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import PlayerDetails from "@/types/IPlayerDetails";
import Loading from "@/components/ui/loading";
import { useLoading } from "@/lib/loading-context";
import { useEffect, useRef } from "react";
import JoueurLayout from "@/components/joueur/joueur-layout";

const fetchPlayerDetails = async (playerId: string): Promise<PlayerDetails> => {
  const response = await fetch(`/api/players/${playerId}`);
  if (!response.ok) {
    console.log(response);
    throw new Error('Erreur lors de la récupération des détails du joueur');
  }
  return response.json();
};

export default function Joueur() {
  const { setPageLoading } = useLoading();
  const hasLoaded = useRef(false);
  const [, params] = useRoute("/joueur/:id");
  const playerId = params?.id;

  const { 
    data: player, 
    isLoading, 
    error 
  } = useQuery<PlayerDetails>({
    queryKey: ['player', playerId],
    queryFn: () => fetchPlayerDetails(playerId || ''),
    enabled: !!playerId,
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
  if (!player) return <div>Joueur non trouvé</div>;

  return (
    <JoueurLayout player={player} />
  );
}
