import Layout from '@/components/Layout';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * The whole page hangs off the player fetch, so even the name is a skeleton.
 * The nav and ticker above it are real and usable immediately.
 */
export default function JoueurSkeleton(): JSX.Element {
  return (
    <Layout>
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[0, 1, 2, 3].map((tab) => <Skeleton key={tab} className="h-9 w-28" />)}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[0, 1, 2, 3].map((stat) => (
          <div key={stat} className="rounded-lg border border-border p-4">
            <Skeleton className="h-3 w-16 mb-3" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>

      <Skeleton className="h-64 w-full rounded-lg" />
    </Layout>
  );
}
