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
import { EchangeCard } from '@/components/echanges/EchangeCard';

export const HomeLatestTrade: React.FC = () => {
  const { data: latestTrade, isLoading, error } = useLatestTrade();

  if (isLoading) return <Loading />;
  if (error) return <InlineError message="Erreur lors du chargement du dernier échange." />;
  if (!latestTrade) return <div>Aucun échange récent.</div>;

  // Adapt HomeTrade to Echange format
  const mappedTrade = {
    id: parseInt(latestTrade.id, 10),
    date: latestTrade.date,
    equipe_source_id: 0, // Not needed for display
    equipe_destination_id: 0, // Not needed for display
    equipe_source_nom: latestTrade.teamA,
    equipe_destination_nom: latestTrade.teamB,
    details: `${latestTrade.playersA.join(', ')} | ${latestTrade.playersB.join(', ')}`,
    statut_confirmer: true,
  } as any; // Cast to any or Echange if imports allow (using simplified mapping)

  return (
    <div className="space-y-6">
      <EchangeCard echange={mappedTrade} compact={true} />
      <div className="flex justify-center">
       
      </div>
    </div>
  );
};
