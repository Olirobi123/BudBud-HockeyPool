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

function formatYearRanges(years: number[]): string {
  if (years.length === 0) return '';
  if (years.length === 1) return String(years[0]);

  const sorted = [...years].sort((a, b) => b - a);
  const ranges: string[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === rangeEnd - 1) {
      rangeEnd = sorted[i];
    } else {
      ranges.push(rangeStart === rangeEnd ? String(rangeStart) : `${rangeEnd}-${rangeStart}`);
      rangeStart = sorted[i];
      rangeEnd = sorted[i];
    }
  }
  ranges.push(rangeStart === rangeEnd ? String(rangeStart) : `${rangeEnd}-${rangeStart}`);

  return ranges.join(', ');
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
