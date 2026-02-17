import { Target } from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import type { LivePlayerPoints } from '@/types/ILivePoints';
import { FeedSkeleton } from './live-points/FeedSkeleton';
import { FeedEmpty } from './live-points/FeedEmpty';
import { FeedTable } from './live-points/FeedTable';

interface LivePointsFeedProps {
  players: LivePlayerPoints[];
  liveGamesCount: number;
  isLoading: boolean;
}

function FeedContent({ players, isLoading }: { players: LivePlayerPoints[]; isLoading: boolean }) {
  if (isLoading) return <FeedSkeleton />;
  if (players.length === 0) return <FeedEmpty />;
  return <FeedTable players={players} />;
}

// eslint-disable-next-line import/prefer-default-export
export function LivePointsFeed({ players, liveGamesCount, isLoading }: LivePointsFeedProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>Marqueurs</span>
          </div>
          {liveGamesCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                {`${liveGamesCount} en cours`}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FeedContent players={players} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
