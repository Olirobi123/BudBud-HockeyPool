import React from 'react';
import { ArrowLeftRight, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Echange from '@/types/IEchange';

interface EchangeStatsProps {
  echanges?: Echange[];
}

export const EchangeStats: React.FC<EchangeStatsProps> = ({ echanges }) => {
  // Defensive programming: ensure echanges is an array
  const safeEchanges = Array.isArray(echanges) ? echanges : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardContent className="p-6 text-center">
          <ArrowLeftRight className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{safeEchanges.length}</div>
          <div className="text-sm text-muted-foreground">Échanges Total</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {safeEchanges.filter((e: Echange) => e.statut_confirmer === false).length}
          </div>
          <div className="text-sm text-muted-foreground">En Attente</div>
        </CardContent>
      </Card>
    </div>
  );
};
