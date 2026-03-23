import { UserPlus } from 'lucide-react';
import { HistoireRepechageEvent } from '@/types/IHistoire';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  event: HistoireRepechageEvent;
  player: PlayerDetails;
};

export default function DraftEventItem({ event, player }: Props) {
  const first = player.firstName?.default ?? '';
  const last = player.lastName?.default ?? '';
  const playerFullName = `${first} ${last}`.trim();

  return (
    <div className="relative">
      {/* type stamp */}
      <div className="flex items-center gap-2 mb-2 ml-1">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-blue-500/10 border border-blue-500/20">
          <UserPlus className="w-3 h-3 text-blue-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
            Repêchage
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {event.annee}
          {' · '}
          {event.type_nom}
        </span>
      </div>

      {/* card */}
      <div className="rounded-lg border border-blue-500/20 bg-card overflow-hidden">
        <div className="flex">
          {/* rank panel */}
          <div className="flex flex-col items-center justify-center px-4 py-4 bg-blue-500/5 border-r border-blue-500/20 w-20 shrink-0 gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/70">
              Rang
            </span>
            <span className="text-4xl font-black tabular-nums leading-none text-blue-400">
              {event.rang}
            </span>
            {event.round !== null && (
              <>
                <div className="w-6 h-px bg-blue-500/20" />
                <span className="text-[10px] font-semibold text-blue-500/60 whitespace-nowrap">
                  {`Ronde ${event.round}`}
                </span>
              </>
            )}
          </div>

          {/* info panel */}
          <div className="flex flex-col justify-center px-4 py-4 gap-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sélectionné par
            </p>
            <p className="text-sm font-bold text-foreground leading-tight">
              {event.equipe_nom}
            </p>
            <p className="text-sm text-muted-foreground">{playerFullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
