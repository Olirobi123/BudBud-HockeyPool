import { JSX } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// eslint-disable-next-line import/prefer-default-export
export function HomeLatestTradeSkeleton(): JSX.Element {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2.5 px-4 bg-muted/40 border-b flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
