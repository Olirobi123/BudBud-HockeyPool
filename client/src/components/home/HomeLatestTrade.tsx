import React from 'react';

import { useLatestTrade } from '@/hooks/home/useLatestTrade';
import Loading from '@/components/ui/loading';
import { InlineError } from '@/components/ui/error-display';
import { EchangeCard } from '@/components/echanges/EchangeCard';
import type Echange from '@/types/IEchange';

export const HomeLatestTrade: React.FC = () => {
  const { data: latestTrade, isLoading, error } = useLatestTrade();

  if (isLoading) return <Loading />;
  if (error) return <InlineError message="Erreur lors du chargement du dernier échange." />;
  if (!latestTrade) return <div>Aucun échange récent.</div>;

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

  return (
    <div className="space-y-6">
      <EchangeCard echange={mappedTrade} compact />
      <div className="flex justify-center" />
    </div>
  );
};
