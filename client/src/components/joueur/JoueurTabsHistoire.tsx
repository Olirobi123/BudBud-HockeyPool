import { History } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import PlayerDetails from '@/types/IPlayerDetails';
import { usePlayerHistory } from '@/hooks/joueur/usePlayerHistory';
import HistoireTimeline from './histoire/HistoireTimeline';

type Props = {
  player: PlayerDetails;
};

export default function JoueurTabsHistoire({ player }: Props) {
  const nhlId = player.playerId?.toString() ?? '';
  const { data, isLoading } = usePlayerHistory(nhlId);

  const isEmpty = !data || data.joueur_id === null || data.events.length === 0;

  return (
    <TabsContent value="histoire">
      {isLoading && (
        <div className="flex justify-center py-16 text-muted-foreground text-sm">
          Chargement de l&apos;historique…
        </div>
      )}

      {!isLoading && isEmpty && (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center">
            <History className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Ce joueur n&apos;a pas d&apos;historique dans le pool.
          </p>
        </div>
      )}

      {!isLoading && !isEmpty && (
        <HistoireTimeline events={data.events} player={player} />
      )}
    </TabsContent>
  );
}
