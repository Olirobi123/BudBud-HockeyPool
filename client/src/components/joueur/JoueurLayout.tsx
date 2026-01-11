import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PlayerDetails from '@/types/IPlayerDetails';
import JoueurHeader from '@/components/joueur/JoueurHeader';
import JoueurTabs from './JoueurTabs';
import JoueurTabsOverview from './JoueurTabsOverview';
import JoueurTabsStats from './JoueurTabsStats';
import JoueurTabsLastFive from './JoueurTabsLastFive';

type Props = {
  player: PlayerDetails;
};

export default function JoueurLayout({ player }: Props) {
  return (
    <div className="min-h-screen bg-background">
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
