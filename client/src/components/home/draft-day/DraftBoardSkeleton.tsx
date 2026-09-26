import { JSX } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ROUNDS = 7;
const PICKS_PER_ROUND = 10;

// eslint-disable-next-line import/prefer-default-export
export function DraftBoardSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: ROUNDS }).map((_, r) => (
        // eslint-disable-next-line react/no-array-index-key
        <Card key={r} className="overflow-hidden">
          <div className="border-b border-border px-3 py-2.5">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="divide-y divide-border/60">
            {Array.from({ length: PICKS_PER_ROUND }).map((__, p) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={p} className="flex items-center gap-3 px-3 py-2.5">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="ml-auto h-4 w-20" />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
