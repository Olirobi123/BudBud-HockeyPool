import { Skeleton } from '@/components/ui/skeleton';

/** Mirrors the two DivisionTable columns, including the division rule at the top. */
export function DivisionStandingsSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {(['nord', 'sud'] as const).map((division) => (
        <div
          key={division}
          className={`rounded-lg border border-border overflow-hidden border-t-[3px] ${
            division === 'nord' ? 'border-t-division-nord' : 'border-t-division-sud'
          }`}
        >
          <div
            className={`border-b p-6 bg-gradient-to-r to-transparent ${
              division === 'nord' ? 'from-division-nord/10' : 'from-division-sud/10'
            }`}
          >
            <Skeleton className="h-6 w-44" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 8 }, (_, i) => i).map((row) => (
              <div key={row} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 flex-1 max-w-[200px]" />
                <Skeleton className="ml-auto h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
