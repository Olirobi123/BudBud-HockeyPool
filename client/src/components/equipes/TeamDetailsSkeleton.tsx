import Layout from '@/components/Layout';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * The division band is greyed rather than blue or red: which division the team
 * belongs to is exactly what we are still waiting to find out.
 */
export default function TeamDetailsSkeleton(): JSX.Element {
  return (
    <Layout>
      <Skeleton className="h-9 w-44 mb-6" />

      <div className="mb-6 rounded-lg border border-border overflow-hidden">
        <Skeleton className="h-24 w-full rounded-none" />
        <div className="relative pb-6 px-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 gap-4">
            <Skeleton className="h-24 w-24 rounded-full border-4 border-card" />
            <div className="flex-1 mt-4 md:mt-0 md:mb-2 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border divide-y divide-border">
        {Array.from({ length: 10 }, (_, i) => i).map((row) => (
          <div key={row} className="flex items-center gap-3 px-4 py-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 flex-1 max-w-[240px]" />
            <Skeleton className="ml-auto h-4 w-10" />
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
    </Layout>
  );
}
