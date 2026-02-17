import { Skeleton } from '@/components/ui/skeleton';

export function FeedSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}
