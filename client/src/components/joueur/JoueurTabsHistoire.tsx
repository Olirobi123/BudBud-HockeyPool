import {
  ArrowLeftRight, UserPlus, UserMinus, History,
} from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import PlayerDetails from '@/types/IPlayerDetails';
import { usePlayerHistory } from '@/hooks/joueur/usePlayerHistory';
import { EchangeCard } from '@/components/echanges/EchangeCard';
import {
  HistoireEvent,
  HistoireEchangeEvent,
  HistoireRepechageEvent,
  HistoireBallotageEvent,
} from '@/types/IHistoire';
import Echange from '@/types/IEchange';

type Props = {
  player: PlayerDetails;
};

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function TradeEventItem(
  { event, player }: { event: HistoireEchangeEvent; player: PlayerDetails },
) {
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
          {formatEventDate(event.date)}
        </span>
      </div>
      <EchangeCard echange={mapped} highlightPlayer={playerFullName} />
    </div>
  );
}

function DraftEventItem(
  { event, player }: { event: HistoireRepechageEvent; player: PlayerDetails },
) {
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
          {/* rank badge — left panel */}
          <div className="flex flex-col items-center justify-center px-5 py-4 bg-blue-500/5 border-r border-blue-500/20 min-w-[72px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500/70 mb-0.5">
              Rang
            </span>
            <span className="text-4xl font-black tabular-nums leading-none text-blue-400">
              {event.rang}
            </span>
            {event.round !== null && (
              <span className="text-[10px] text-blue-500/60 mt-1 tabular-nums whitespace-nowrap">
                Ronde
                {' '}
                {event.round}
              </span>
            )}
          </div>

          {/* info — right panel */}
          <div className="flex flex-col justify-center px-4 py-4 gap-1">
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

function BallotageEventItem(
  { event, player }: { event: HistoireBallotageEvent; player: PlayerDetails },
) {
  const first = player.firstName?.default ?? '';
  const last = player.lastName?.default ?? '';
  const playerFullName = `${first} ${last}`.trim();

  return (
    <div className="relative">
      {/* type stamp */}
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

      {/* card */}
      <div className="rounded-lg border border-amber-500/20 bg-card overflow-hidden">
        <div className="flex items-stretch">
          {/* amber bar */}
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

function EventItem({ event, player }: { event: HistoireEvent; player: PlayerDetails }) {
  if (event.type === 'echange') return <TradeEventItem event={event} player={player} />;
  if (event.type === 'repechage') return <DraftEventItem event={event} player={player} />;
  return <BallotageEventItem event={event} player={player} />;
}

function eventKey(event: HistoireEvent): string {
  return `${event.type}-${event.id}`;
}

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
        <div className="flex flex-col items-center gap-4 py-20 text-center min-h-[60vh] justify-center">
          <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center">
            <History className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Ce joueur n&apos;a pas d&apos;historique dans le pool.
          </p>
        </div>
      )}

      {!isLoading && !isEmpty && (
        <div className="relative">
          {/* timeline rail */}
          <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {data.events.reduce<React.ReactNode[]>((acc, event, idx) => {
              const year = event.sort_date.slice(0, 4);
              const prevYear = idx > 0 ? data.events[idx - 1].sort_date.slice(0, 4) : null;

              if (year !== prevYear) {
                acc.push(
                  <div key={`year-${year}`} className="flex items-center gap-4">
                    {/* dot on rail */}
                    <div className="w-[23px] flex-shrink-0 flex justify-center">
                      <div className="w-3 h-3 rounded-full border-2 border-border bg-background z-10" />
                    </div>
                    {/* year label + rule */}
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
                  {/* connector dot */}
                  <div className="w-[23px] flex-shrink-0 flex justify-center pt-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <EventItem event={event} player={player} />
                  </div>
                </div>,
              );

              return acc;
            }, [])}
          </div>
        </div>
      )}
    </TabsContent>
  );
}
