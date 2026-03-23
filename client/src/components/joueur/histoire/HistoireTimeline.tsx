import { HistoireEvent } from '@/types/IHistoire';
import PlayerDetails from '@/types/IPlayerDetails';
import HistoireEventItem from './HistoireEventItem';

type Props = {
  events: HistoireEvent[];
  player: PlayerDetails;
};

function eventKey(event: HistoireEvent): string {
  return `${event.type}-${event.id}`;
}

export default function HistoireTimeline({ events, player }: Props) {
  return (
    <div className="relative">
      <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />

      <div className="space-y-8">
        {events.reduce<React.ReactNode[]>((acc, event, idx) => {
          const year = event.sort_date.slice(0, 4);
          const prevYear = idx > 0 ? events[idx - 1].sort_date.slice(0, 4) : null;

          if (year !== prevYear) {
            acc.push(
              <div key={`year-${year}`} className="flex items-center gap-4">
                <div className="w-[23px] flex-shrink-0 flex justify-center">
                  <div className="w-3 h-3 rounded-full border-2 border-border bg-background z-10" />
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl font-black tracking-tight text-foreground/20 flex-shrink-0">
                    {year}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </div>,
            );
          }

          acc.push(
            <div key={eventKey(event)} className="flex gap-4 items-start">
              <div className="w-[23px] flex-shrink-0 flex justify-center pt-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
              </div>
              <div className="flex-1 min-w-0">
                <HistoireEventItem event={event} player={player} />
              </div>
            </div>,
          );

          return acc;
        }, [])}
      </div>
    </div>
  );
}
