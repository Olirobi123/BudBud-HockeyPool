import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { HomeActivityFeed } from '@/components/home/HomeActivityFeed';
import { HomeLatestTrade } from '@/components/home/HomeLatestTrade';
import { HomeQuickActions } from '@/components/home/HomeQuickActions';

export default function Home(): JSX.Element {
  return (
    <Layout
      bgClassName="bg-slate-900"
      beforeContainer={<HeroSection />}
      mainPadding="py-16"
      mainClassName="bg-card"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activité en Direct */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Activité en Direct</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-success font-medium">En direct</span>
            </div>
          </div>
          <HomeActivityFeed />
        </div>
        {/* Sidebar */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-6">Dernier Échange</h3>
          <HomeLatestTrade />
          <HomeQuickActions />
        </div>
      </div>
    </Layout>
  );
}
