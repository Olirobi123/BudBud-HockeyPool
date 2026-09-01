import { JSX } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  /** Primary line, e.g. "Aucun match ce soir". */
  message: string;
  /** Optional second line for context. */
  // eslint-disable-next-line react/require-default-props
  hint?: string;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

/**
 * Shared empty state — icon at low opacity above a muted message.
 *
 * Consolidates a pattern that was hand-rolled in five places
 * (LeaderboardEmpty, PointsLeaderboardEmpty, FeedEmpty, HomeLatestTrade,
 * PlayoffWidget). Use this rather than adding a sixth variant.
 */
// eslint-disable-next-line import/prefer-default-export
export function EmptyState({
  icon: Icon, message, hint, className,
}: EmptyStateProps): JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <Icon className="w-10 h-10 text-muted-foreground/30 mb-3" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {hint !== undefined && (
        <p className="mt-1 text-xs text-muted-foreground/70">{hint}</p>
      )}
    </div>
  );
}
