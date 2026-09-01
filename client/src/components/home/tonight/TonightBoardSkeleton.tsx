import { JSX } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/** Mirrors the TonightBoard band structure so the layout does not jump on load. */
// eslint-disable-next-line import/prefer-default-export
export function TonightBoardSkeleton(): JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="ml-auto h-4 w-20" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => i).map((i) => (
          <div key={i} className="rounded-lg border border-border p-3">
            <Skeleton className="mb-3 h-3 w-12" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-4 w-9" />
                <Skeleton className="ml-auto h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-4 w-9" />
                <Skeleton className="ml-auto h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-3">
            <Skeleton className="h-3 w-28" />
            {Array.from({ length: 4 }, (_, i) => i).map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
