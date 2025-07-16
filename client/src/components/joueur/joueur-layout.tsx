import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PlayerDetails from '@/types/IPlayerDetails';
import JoueurHeader from '@/components/joueur/joueur-header';
import JoueurTabs from './joueur-tabs';
import JoueurTabsOverview from './joueur-tabs-overview';
import JoueurTabsStats from './joueur-tabs-stats';
import JoueurTabsLastFive from './joueur-tabs-last-five';

type Props = {
  player: PlayerDetails;
};

export default function JoueurLayout({ player }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JoueurHeader player={player} />
          <JoueurTabs player={player}>
            <JoueurTabsOverview />
            <JoueurTabsLastFive />
            <JoueurTabsStats />
          </JoueurTabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
