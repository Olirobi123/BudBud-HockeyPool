import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import PlayerDetails from "@/types/IPlayerDetails";
import { useRoute } from "wouter";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
  const [, params] = useRoute("/joueur/:id");
  const playerId = params?.id;

  const { data: player, isLoading, error } = useQuery<PlayerDetails>({
    queryKey: ['player', playerId],
    queryFn: () => fetchPlayerDetails(playerId || ''),
    enabled: !!playerId,
  });

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {(error as Error).message}</div>;
  if (!player) return <div>Joueur non trouvé</div>;

  return (
      <JoueurLayout player={player}>
      </JoueurLayout>
  );
}
