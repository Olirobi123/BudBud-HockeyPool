import React from 'react';
import Echange from '@/types/IEchange';
import { EchangeCard } from './EchangeCard';

interface EchangeListProps {
  echanges?: Echange[];
}

export const EchangeList: React.FC<EchangeListProps> = ({ echanges }) => {
  const safeEchanges = echanges ?? [];

  // Group by month (YYYY-MM)
  const echangesParMois = safeEchanges.reduce((acc, echange) => {
    const d = new Date(echange.date);
    const mois = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
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
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
