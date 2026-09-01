import { JSX } from 'react';
import Layout from '@/components/Layout';
import { TonightBoard } from '@/components/home/tonight/TonightBoard';
import { LivePointsFeed } from '@/components/home/LivePointsFeed';
import { LivePointsLeaderboard } from '@/components/home/LivePointsLeaderboard';
import { HomeLatestTrade } from '@/components/home/HomeLatestTrade';
import { PointsLeaderboard } from '@/components/home/PointsLeaderboard';
import { PlayoffWidget } from '@/components/home/PlayoffWidget';
import { useLivePoints } from '@/hooks/home/useLivePoints';
import { usePointsRankings } from '@/hooks/home/usePointsRankings';

export default function Home(): JSX.Element {
  const { data, isLoading } = useLivePoints();
  const { data: rankingsData, isLoading: rankingsLoading } = usePointsRankings();

  return (
    <Layout
      hideTicker
      beforeContainer={<TonightBoard />}
      mainPadding="py-10"
    >
      {/* Each card carries its own title — no eyebrow labels here. (UI_Audit P3) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="order-1 lg:order-none lg:col-span-2">
          <LivePointsLeaderboard
            teams={data?.teamLeaderboard ?? []}
            isLoading={isLoading}
          />
        </div>

        <div className="order-2 lg:order-none">
          <LivePointsFeed
            players={data?.topPlayers ?? []}
            liveGamesCount={data?.liveGamesCount ?? 0}
            isLoading={isLoading}
          />
        </div>

        <div className="order-3 lg:order-none lg:col-span-2">
          <PointsLeaderboard
            teams={rankingsData ?? []}
            isLoading={rankingsLoading}
          />
        </div>

        <div className="order-4 lg:order-none">
          <HomeLatestTrade />
        </div>

        <div className="order-5 lg:order-none lg:col-span-2">
          <PlayoffWidget />
        </div>
      </div>
    </Layout>
  );
}
