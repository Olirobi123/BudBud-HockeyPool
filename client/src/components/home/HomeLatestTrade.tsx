import React from 'react';
import { useLatestTrade } from '@/hooks/home/useLatestTrade';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
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
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{latestTrade.date}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">{latestTrade.teamA}</h4>
            <div className="space-y-1">
              {latestTrade.playersA.map((player, index) => (
                <div key={index} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{player}</div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 font-bold">↕</div>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 mb-2">{latestTrade.teamB}</h4>
            <div className="space-y-1">
              {latestTrade.playersB.map((player, index) => (
                <div key={index} className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">{player}</div>
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