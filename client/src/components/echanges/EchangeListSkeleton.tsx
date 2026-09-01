import { Skeleton } from '@/components/ui/skeleton';

/** Mirrors the filter bar + a month of EchangeCards so the layout does not jump on load. */
export function EchangeListSkeleton(): JSX.Element {
  return (
    <div>
      <div className="bg-muted/40 border border-border rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-9 w-full max-w-[160px]" />
        <Skeleton className="h-9 w-full max-w-[140px]" />
      </div>

      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-border" />
        <Skeleton className="h-6 w-28 rounded-full" />
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="space-y-4">
        {[0, 1, 2].map((card) => (
          <div key={card} className="rounded-lg border border-border overflow-hidden">
            <div className="py-2.5 px-4 bg-muted/40 border-b flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3">
              {[0, 1].map((side) => (
                <div key={side} className={side === 0 ? 'sm:pr-5 sm:border-r sm:border-border' : 'sm:pl-5'}>
                  <Skeleton className="h-2.5 w-12 mb-2" />
                  <Skeleton className="h-4 w-44 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-3.5 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
