import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'wouter';
import { useLatestTrade } from '@/hooks/home/useLatestTrade';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { InlineError } from '@/components/ui/error-display';

export const HomeLatestTrade: React.FC = () => {
  const { data: latestTrade, isLoading, error } = useLatestTrade();

  if (isLoading) return <Loading />;
  if (error) return <InlineError message="Erreur lors du chargement du dernier échange." />;
  if (!latestTrade) return <div>Aucun échange récent.</div>;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Échange Récent</CardTitle>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{latestTrade.date}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">{latestTrade.teamA}</h4>
            <div className="space-y-1">
              {latestTrade.playersA.map((player, index) => (
                <div key={index} className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{player}</div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground font-bold">↕</div>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-foreground mb-2">{latestTrade.teamB}</h4>
            <div className="space-y-1">
              {latestTrade.playersB.map((player, index) => (
                <div key={index} className="text-sm bg-accent/10 text-accent px-2 py-1 rounded">{player}</div>
              ))}
            </div>
          </div>
        </div>
        <Link href="/echanges">
          <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
            Voir tous les Échanges
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
