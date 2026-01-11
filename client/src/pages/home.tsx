import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import { HomeActivityFeed } from '@/components/home/HomeActivityFeed';
import { HomeLatestTrade } from '@/components/home/HomeLatestTrade';
import { HomeQuickActions } from '@/components/home/HomeQuickActions';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <HeroSection />
      {/* Section Activité en Direct et Sidebar */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Activité en Direct */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Activité en Direct</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">En direct</span>
                </div>
              </div>
              <HomeActivityFeed />
            </div>
            {/* Sidebar */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Dernier Échange</h3>
              <HomeLatestTrade />
              <HomeQuickActions />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
