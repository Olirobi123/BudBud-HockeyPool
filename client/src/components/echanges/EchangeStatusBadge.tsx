import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EchangeStatusBadgeProps {
  statut_confirmer: boolean;
}

export const EchangeStatusBadge: React.FC<EchangeStatusBadgeProps> = ({ statut_confirmer }) => (statut_confirmer ? (
  <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Complété</Badge>
) : (
  <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/90">En Attente</Badge>
));
