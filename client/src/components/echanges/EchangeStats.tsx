import React from 'react';
import { ArrowLeftRight, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Echange from '@/types/IEchange';

interface EchangeStatsProps {
  echanges: Echange[];
}

export const EchangeStats: React.FC<EchangeStatsProps> = ({ echanges }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <Card>
      <CardContent className="p-6 text-center">
        <ArrowLeftRight className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">{echanges.length}</div>
        <div className="text-sm text-gray-600">Échanges Total</div>
      </CardContent>
    </Card>
    <Card>
      <CardContent className="p-6 text-center">
        <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">
          {echanges.filter((e) => e.statut_confirmer === false).length}
        </div>
        <div className="text-sm text-gray-600">En Attente</div>
      </CardContent>
    </Card>
  </div>
); 