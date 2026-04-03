import { ArrowLeftRight } from 'lucide-react';
import { EchangeCard } from '@/components/echanges/EchangeCard';
import { HistoireEchangeEvent } from '@/types/IHistoire';
import Echange from '@/types/IEchange';
import PlayerDetails from '@/types/IPlayerDetails';
import { formatDate } from '@/lib/utils';

type Props = {
  event: HistoireEchangeEvent;
  player: PlayerDetails;
};

export default function TradeEventItem({ event, player }: Props) {
  const first = player.firstName?.default ?? '';
  const last = player.lastName?.default ?? '';
  const playerFullName = `${first} ${last}`.trim();

  const mapped: Echange = {
    id: event.id,
    date: event.date,
    equipe_source_id: event.equipe_source_id,
    equipe_destination_id: event.equipe_destination_id,
    equipe_source_nom: event.equipe_source_nom,
    equipe_destination_nom: event.equipe_destination_nom,
    joueurs_source: event.joueurs_source,
    joueurs_destination: event.joueurs_destination,
    statut_confirmer: event.statut_confirmer,
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2 ml-1">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-green-500/10 border border-green-500/20">
          <ArrowLeftRight className="w-3 h-3 text-green-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">
            Échange
          </span>
        </span>
        <span className="text-xs text-muted-foreground font-mono">
          {formatDate(event.date)}
        </span>
      </div>
      <EchangeCard echange={mapped} highlightPlayer={playerFullName} />
    </div>
  );
}
