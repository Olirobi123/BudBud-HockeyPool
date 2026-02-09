import { TropheeGagnant } from '@/types';
import { TropheeIcon } from './TropheeIcon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TropheeCardProps {
  trophee: TropheeGagnant;
  compact?: boolean;
}

export function TropheeCard({ trophee, compact = false }: TropheeCardProps) {
  const isGeneral = trophee.trophee_nom === 'Général';

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
        <Badge variant="secondary" className="text-xs">
          {trophee.annee}
        </Badge>
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
      <Badge
        variant="secondary"
        className={cn(
          isGeneral && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
        )}
      >
        {trophee.annee}
      </Badge>
    </div>
  );
}
