import { UserMinus } from 'lucide-react';
import { HistoireBallotageEvent } from '@/types/IHistoire';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  event: HistoireBallotageEvent;
  player: PlayerDetails;
};

export default function BallotageEventItem({ event, player }: Props) {
  const first = player.firstName?.default ?? '';
  const last = player.lastName?.default ?? '';
  const playerFullName = `${first} ${last}`.trim();

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2 ml-1">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20">
          <UserMinus className="w-3 h-3 text-amber-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Ballotage
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {event.annee}
          {' · '}
          {event.type_nom}
        </span>
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-card overflow-hidden">
        <div className="flex items-stretch">
          <div className="w-1 bg-amber-500/60 flex-shrink-0" />
          <div className="flex items-center gap-4 px-4 py-3 flex-1">
            <UserMinus className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">{playerFullName}</p>
              <p className="text-xs text-muted-foreground">
                Retiré par
                {' '}
                {event.equipe_nom}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
