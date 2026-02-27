import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import Echange from '@/types/IEchange';
import { EchangeCard } from './EchangeCard';

interface EchangeListProps {
  echanges?: Echange[];
  isFiltered?: boolean;
}

export const EchangeList: React.FC<EchangeListProps> = ({ echanges, isFiltered = false }) => {
  const safeEchanges = echanges ?? [];

  if (safeEchanges.length === 0 && isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/60 border border-border flex items-center justify-center mb-4">
          <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-foreground text-sm font-medium">Aucun échange trouvé</p>
        <p className="text-muted-foreground text-xs mt-1">Essayez de modifier les filtres</p>
      </div>
    );
  }

  // Group by month (YYYY-MM)
  const echangesParMois = safeEchanges.reduce((acc, echange) => {
    const mois = echange.date.slice(0, 7); // "YYYY-MM"
    if (acc[mois] === undefined) acc[mois] = [];
    acc[mois].push(echange);
    return acc;
  }, {} as Record<string, Echange[]>);

  // Sort months descending
  const sortedMonths = Object.keys(echangesParMois).sort().reverse();

  let cardIndex = 0;

  return (
    <div className="space-y-2">
      {sortedMonths.map((mois) => {
        const monthTrades = [...echangesParMois[mois]].sort(
          (a, b) => b.date.localeCompare(a.date),
        );

        const [year, month] = mois.split('-').map(Number);
        const label = new Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: 'long' })
          .format(new Date(year, month - 1, 1));

        return (
          <div key={mois}>
            {/* Month divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground bg-background px-3 py-1 rounded-full border border-border font-medium">
                {label}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="space-y-4">
              {monthTrades.map((echange) => {
                const delay = `${(cardIndex % 6) * 60}ms`;
                cardIndex += 1;
                return (
                  <EchangeCard
                    key={echange.id}
                    echange={echange}
                    animationDelay={delay}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
