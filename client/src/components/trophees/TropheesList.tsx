import { Trophy } from 'lucide-react';
import { GroupedTrophee } from '@/types';
import { TropheeCard } from './TropheeCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TropheesListProps {
  generalTrophees: GroupedTrophee[];
  otherTrophees: GroupedTrophee[];
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

export function TropheesList({ generalTrophees, otherTrophees, isLoading }: TropheesListProps) {
  if (isLoading) {
    return <TropheesSkeleton />;
  }

  if (generalTrophees.length === 0 && otherTrophees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Aucun trophée remporté</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {generalTrophees.map((trophee) => (
        <TropheeCard key={trophee.trophee_nom} trophee={trophee} />
      ))}

      {otherTrophees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {otherTrophees.map((trophee) => (
            <TropheeCard key={trophee.trophee_nom} trophee={trophee} />
          ))}
        </div>
      )}
    </div>
  );
}
