import React from 'react';
import Echange from '@/types/IEchange';
import { EchangeCard } from './EchangeCard';

interface EchangeListProps {
  echanges?: Echange[];
}

export const EchangeList: React.FC<EchangeListProps> = ({ echanges }) => {
  // Defensive programming: ensure echanges is an array
  const safeEchanges = Array.isArray(echanges) ? echanges : [];

  // Grouper les échanges par mois
  const echangesParMois = safeEchanges.reduce((acc, echange) => {
    const mois = echange.date.substring(0, 7); // Format: YYYY-MM
    if (!acc[mois]) acc[mois] = [];
    acc[mois].push(echange);
    return acc;
  }, {} as Record<string, Echange[]>);

  return (
    <div className="space-y-8">
      {Object.entries(echangesParMois).map(([mois, echangesDuMois]) => (
        <div key={mois}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {new Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: 'long' })
              .format(new Date(`${mois}-01`))}
          </h2>
          <div className="space-y-4">
            {echangesDuMois.map((echange) => (
              <EchangeCard key={echange.id} echange={echange} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
