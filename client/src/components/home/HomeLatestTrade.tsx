import { ArrowLeftRight } from 'lucide-react';
import { useLatestTrade } from '@/hooks/home/useLatestTrade';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { InlineError } from '@/components/ui/error-display';
import { EchangeCard } from '@/components/echanges/EchangeCard';
import type Echange from '@/types/IEchange';

function HomeLatestTradeSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2.5 px-4 bg-muted/40 border-b flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line import/prefer-default-export
export function HomeLatestTrade(): JSX.Element | null {
  const { data: latestTrade, isLoading, error } = useLatestTrade();

  if (isLoading) return <HomeLatestTradeSkeleton />;
  if (error) return <InlineError message="Erreur lors du chargement du dernier échange." />;
  if (!latestTrade) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <ArrowLeftRight className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Aucun échange récent.</p>
      </div>
    );
  }

  const mappedTrade: Echange = {
    id: parseInt(latestTrade.id, 10),
    date: latestTrade.date,
    equipe_source_id: 0,
    equipe_destination_id: 0,
    equipe_source_nom: latestTrade.teamA,
    equipe_destination_nom: latestTrade.teamB,
    joueurs_source: latestTrade.playersA,
    joueurs_destination: latestTrade.playersB,
    statut_confirmer: true,
  };

  return <EchangeCard echange={mappedTrade} />;
}
