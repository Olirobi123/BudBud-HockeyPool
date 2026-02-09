import { Trophy } from 'lucide-react';
import { TropheeGagnant } from '@/types';
import { TropheeCard } from './TropheeCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TropheesListProps {
  trophees: TropheeGagnant[];
  isLoading?: boolean;
}

function TropheesSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    </div>
  );
}

export function TropheesList({ trophees, isLoading }: TropheesListProps) {
  if (isLoading) {
    return <TropheesSkeleton />;
  }

  if (!trophees || trophees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Aucun trophée remporté</p>
      </div>
    );
  }

  const generalTrophees = trophees.filter((t) => t.trophee_nom === 'Général');
  const otherTrophees = trophees.filter((t) => t.trophee_nom !== 'Général');

  return (
    <div className="space-y-3">
      {generalTrophees.map((trophee) => (
        <TropheeCard key={trophee.id} trophee={trophee} />
      ))}

      {otherTrophees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherTrophees.map((trophee) => (
            <TropheeCard key={trophee.id} trophee={trophee} />
          ))}
        </div>
      )}
    </div>
  );
}
