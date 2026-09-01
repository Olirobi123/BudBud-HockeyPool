import { Skeleton } from '@/components/ui/skeleton';

/** Mirrors the draft filter bar and a round of picks so the layout does not jump on load. */
export function DraftTableSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-center gap-3">
        {[140, 160, 120, 180].map((w) => (
          <Skeleton key={w} className="h-9" style={{ width: w }} />
        ))}
      </div>

      {[0, 1].map((round) => (
        <div key={round}>
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="rounded-lg border border-border divide-y divide-border">
            {Array.from({ length: 6 }, (_, i) => i).map((row) => (
              <div key={row} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 flex-1 max-w-[220px]" />
                <Skeleton className="ml-auto h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
