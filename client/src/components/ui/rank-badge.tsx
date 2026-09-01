import { cn } from '@/lib/utils';

/*
 * The podium is the one place ranking carries colour. Gold, silver and bronze
 * encode finishing position; everything from 4th down is grey, so the top three
 * read at a glance without the rest of the table competing for attention.
 */
const PODIUM: Record<number, string> = {
  1: 'bg-rank-gold-fill text-rank-gold-ink ring-1 ring-rank-gold/40',
  2: 'bg-rank-silver-fill text-rank-silver-ink ring-1 ring-rank-silver/40',
  3: 'bg-rank-bronze-fill text-rank-bronze-ink ring-1 ring-rank-bronze/40',
};

interface RankBadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className }: RankBadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums shrink-0',
        PODIUM[rank] ?? 'text-muted-foreground',
        className,
      )}
    >
      {rank}
    </span>
  );
}
