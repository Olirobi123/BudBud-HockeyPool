import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { LivePointsFeed } from '@/components/home/LivePointsFeed';
import { LivePointsLeaderboard } from '@/components/home/LivePointsLeaderboard';
import { HomeLatestTrade } from '@/components/home/HomeLatestTrade';
import { useLivePoints } from '@/hooks/home/useLivePoints';

export default function Home(): JSX.Element {
  const { data, isLoading } = useLivePoints();

  return (
    <Layout
      bgClassName="bg-slate-900"
      beforeContainer={<HeroSection />}
      mainPadding="py-16"
      mainClassName="bg-card"
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-wide">
            Points en Direct
          </h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">En direct</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main focus - Team leaderboard */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Classement Pool
            </h3>
          </div>
          <LivePointsLeaderboard
            teams={data?.teamLeaderboard ?? []}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar - Top scorers + Latest trade */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Top Marqueurs
              </h3>
            </div>
            <LivePointsFeed
              players={data?.topPlayers ?? []}
              liveGamesCount={data?.liveGamesCount ?? 0}
              isLoading={isLoading}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Dernier Échange
              </h3>
            </div>
            <HomeLatestTrade />
          </div>
        </div>
      </div>
    </Layout>
  );
}
