import { JSX } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ROWS = 10;

// eslint-disable-next-line import/prefer-default-export
export function RankingListSkeleton(): JSX.Element {
  return (
    <div className="divide-y divide-border/60">
      {Array.from({ length: ROWS }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-center gap-4 px-2 py-3">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
