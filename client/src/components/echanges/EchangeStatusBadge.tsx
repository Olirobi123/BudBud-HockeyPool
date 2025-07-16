import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EchangeStatusBadgeProps {
  statut_confirmer: boolean;
}

export const EchangeStatusBadge: React.FC<EchangeStatusBadgeProps> = ({ statut_confirmer }) => {
  return statut_confirmer ? (
    <Badge className="bg-green-500 text-white">Complété</Badge>
  ) : (
    <Badge className="bg-yellow-500 text-white">En Attente</Badge>
  );
}; 