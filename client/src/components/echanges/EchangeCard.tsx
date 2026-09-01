import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import Echange from '@/types/IEchange';

/*
 * A trade has two sides and they must never be confused for one another. The
 * sides borrow the division palette — blue for the team on the left, red for
 * the team on the right — so the split reads instantly. The colour is on the
 * marker, the eyebrow and the bullets only; names, players and the card itself
 * stay monochrome.
 *
 * Note this is side, not division: both teams in a trade are often in the same
 * division, and two blue columns would defeat the point.
 */
type Side = 'nord' | 'sud';

const SIDE = {
  nord: { dot: 'bg-division-nord', label: 'text-division-nord-ink', bullet: 'text-division-nord' },
  sud: { dot: 'bg-division-sud', label: 'text-division-sud-ink', bullet: 'text-division-sud' },
} satisfies Record<Side, { dot: string; label: string; bullet: string }>;

interface EchangeCardProps {
  echange: Echange;
  animationDelay?: string;
  highlightPlayer?: string;
}

function TeamHeader({ name, side }: { name: string; side: Side }) {
  return (
    <div>
      <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${SIDE[side].label}`}>
        Reçoit
      </p>
      <h3 className="font-semibold text-foreground text-sm flex items-start gap-1.5">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${SIDE[side].dot}`} />
        {name}
      </h3>
    </div>
  );
}

function PlayerList(
  { players, side, highlightPlayer }: {
    players: string[];
    side: Side;
    highlightPlayer?: string;
  },
) {
  return (
    <ul className="space-y-1">
      {players.map((joueur) => {
        const isHighlighted = highlightPlayer !== undefined && joueur === highlightPlayer;
        return (
          <li key={joueur} className="text-sm flex gap-1.5">
            <span className={`flex-shrink-0 mt-0.5 text-xs ${SIDE[side].bullet}`}>›</span>
            <span className={`whitespace-pre-wrap ${isHighlighted ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
              {joueur}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export const EchangeCard: React.FC<EchangeCardProps> = ({ echange, animationDelay, highlightPlayer }) => (
  <Card
    className="overflow-hidden hover:shadow-md transition-all duration-200 animate-slide-up"
    style={{ animationDelay, animationFillMode: 'both' }}
  >
    <CardHeader className="py-2.5 px-4 bg-muted/40 border-b flex flex-row items-center justify-between space-y-0">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Transaction
      </span>
      <time className="text-xs text-muted-foreground font-mono">
        {formatDate(echange.date)}
      </time>
    </CardHeader>

    <CardContent className="p-4">
      {/* Mobile: simple stacked */}
      <div className="sm:hidden space-y-3">
        <div className="pb-3 border-b border-border">
          <TeamHeader name={echange.equipe_source_nom} side="nord" />
          <div className="mt-2">
            <PlayerList players={echange.joueurs_source} side="nord" highlightPlayer={highlightPlayer} />
          </div>
        </div>
        <div>
          <TeamHeader name={echange.equipe_destination_nom} side="sud" />
          <div className="mt-2">
            <PlayerList players={echange.joueurs_destination} side="sud" highlightPlayer={highlightPlayer} />
          </div>
        </div>
      </div>

      {/* Desktop: 4-cell grid — header row + player row, both sides aligned */}
      <div className="hidden sm:grid sm:grid-cols-2">
        {/* Row 1: team headers */}
        <div className="pr-5 pb-3 border-r border-border">
          <TeamHeader name={echange.equipe_source_nom} side="nord" />
        </div>
        <div className="pl-5 pb-3">
          <TeamHeader name={echange.equipe_destination_nom} side="sud" />
        </div>
        {/* Row 2: player lists — always starts at same y */}
        <div className="pr-5 pt-2 border-r border-border">
          <PlayerList players={echange.joueurs_source} side="nord" highlightPlayer={highlightPlayer} />
        </div>
        <div className="pl-5 pt-2">
          <PlayerList players={echange.joueurs_destination} side="sud" highlightPlayer={highlightPlayer} />
        </div>
      </div>
    </CardContent>
  </Card>
);
