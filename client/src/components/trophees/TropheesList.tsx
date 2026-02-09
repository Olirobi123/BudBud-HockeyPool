import { Trophy } from 'lucide-react';
import { TropheeGagnant } from '@/types';
import { TropheeCard, GroupedTrophee } from './TropheeCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TropheesListProps {
  trophees: TropheeGagnant[];
  isLoading?: boolean;
}

function groupTrophees(trophees: TropheeGagnant[]): GroupedTrophee[] {
  const grouped = new Map<string, GroupedTrophee>();

  for (const t of trophees) {
    const existing = grouped.get(t.trophee_nom);
    if (existing) {
      existing.annees.push(t.annee);
    } else {
      grouped.set(t.trophee_nom, {
        trophee_nom: t.trophee_nom,
        annees: [t.annee],
        equipe_nom: t.equipe_nom,
      });
    }
  }

  return Array.from(grouped.values());
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

  const groupedTrophees = groupTrophees(trophees);
  const generalTrophees = groupedTrophees.filter((t) => t.trophee_nom === 'Général');
  const otherTrophees = groupedTrophees.filter((t) => t.trophee_nom !== 'Général');

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
