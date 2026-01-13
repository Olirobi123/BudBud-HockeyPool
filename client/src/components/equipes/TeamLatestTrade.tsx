import { ArrowLeftRight } from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { EchangeCard } from '@/components/echanges/EchangeCard';
import { Echange } from '@/types';

interface TeamLatestTradeProps {
  trade: Echange | null;
  isLoading: boolean;
}

export function TeamLatestTrade({ trade, isLoading }: TeamLatestTradeProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader><div className="h-6 w-1/3 bg-gray-200 rounded" /></CardHeader>
        <CardContent><div className="h-32 bg-gray-100 rounded" /></CardContent>
      </Card>
    );
  }

  if (!trade) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Dernière Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">
          Aucune transaction récente trouvée.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <ArrowLeftRight className="w-5 h-5" />
        Dernière Transaction
      </h3>
      <EchangeCard echange={trade} compact />
    </div>
  );
}
