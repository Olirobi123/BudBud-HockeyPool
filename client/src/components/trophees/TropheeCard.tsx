import { TropheeIcon } from './TropheeIcon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface GroupedTrophee {
  trophee_nom: string;
  annees: number[];
  equipe_nom?: string;
}

interface TropheeCardProps {
  trophee: GroupedTrophee;
  compact?: boolean;
}

export function TropheeCard({ trophee, compact = false }: TropheeCardProps) {
  const isGeneral = trophee.trophee_nom === 'Général';
  const sortedYears = [...trophee.annees].sort((a, b) => b - a);

  if (compact) {
    return (
      <div className={cn(
        'flex items-center gap-2 px-2 py-1 rounded',
        isGeneral && 'bg-amber-500/10',
      )}
      >
        <TropheeIcon type={trophee.trophee_nom} size="sm" />
        <span className={cn(
          'text-sm',
          isGeneral && 'text-amber-700 dark:text-amber-400 font-medium',
        )}
        >
          {trophee.trophee_nom}
        </span>
        <div className="flex gap-1 flex-wrap">
          {sortedYears.map((annee) => (
            <Badge key={annee} variant="secondary" className="text-xs">
              {annee}
            </Badge>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg',
      isGeneral
        ? 'bg-amber-500/10 ring-2 ring-amber-500/50'
        : 'bg-muted',
    )}
    >
      <TropheeIcon
        type={trophee.trophee_nom}
        size={isGeneral ? 'lg' : 'md'}
      />
      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-semibold',
          isGeneral && 'text-amber-700 dark:text-amber-400',
        )}
        >
          {trophee.trophee_nom}
        </p>
        {trophee.equipe_nom && (
          <p className="text-sm text-muted-foreground">
            {trophee.equipe_nom}
          </p>
        )}
      </div>
      <div className="flex gap-1 flex-wrap justify-end">
        {sortedYears.map((annee) => (
          <Badge
            key={annee}
            variant="secondary"
            className={cn(
              isGeneral && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
            )}
          >
            {annee}
          </Badge>
        ))}
      </div>
    </div>
  );
}
