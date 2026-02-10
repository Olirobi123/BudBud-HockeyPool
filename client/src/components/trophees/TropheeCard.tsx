import { TropheeIcon } from './TropheeIcon';
import { Badge } from '@/components/ui/badge';
import { cn, formatYearRanges } from '@/lib/utils';
import { GroupedTrophee } from '@/types';

interface TropheeCardProps {
  trophee: GroupedTrophee;
  compact?: boolean;
}

export function TropheeCard({ trophee, compact = false }: TropheeCardProps) {
  const isGeneral = trophee.trophee_nom === 'Général';
  const count = trophee.annees.length;
  const yearsDisplay = formatYearRanges(trophee.annees);

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
        {count > 1 && (
          <Badge variant="secondary" className="text-xs">
            ×{count}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {yearsDisplay}
        </span>
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
        <div className="flex items-center gap-2">
          <p className={cn(
            'font-semibold',
            isGeneral && 'text-amber-700 dark:text-amber-400',
          )}
          >
            {trophee.trophee_nom}
          </p>
          {count > 1 && (
            <Badge
              variant="secondary"
              className={cn(
                'text-xs',
                isGeneral && 'bg-amber-500/20 text-amber-700 dark:text-amber-400',
              )}
            >
              ×{count}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {yearsDisplay}
        </p>
      </div>
    </div>
  );
}
