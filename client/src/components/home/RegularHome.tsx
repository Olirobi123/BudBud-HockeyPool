import { JSX } from 'react';
import { LivePointsFeed } from '@/components/home/LivePointsFeed';
import { LivePointsLeaderboard } from '@/components/home/LivePointsLeaderboard';
import { HomeLatestTrade } from '@/components/home/HomeLatestTrade';
import { PointsLeaderboard } from '@/components/home/PointsLeaderboard';
import { PlayoffWidget } from '@/components/home/PlayoffWidget';
import { useLivePoints } from '@/hooks/home/useLivePoints';
import { usePointsRankings } from '@/hooks/home/usePointsRankings';

/** La home habituelle — affichée hors du jour du repêchage. */
// eslint-disable-next-line import/prefer-default-export
export function RegularHome(): JSX.Element {
  const { data, isLoading } = useLivePoints();
  const { data: rankingsData, isLoading: rankingsLoading } = usePointsRankings();

  // Each card carries its own title — no eyebrow labels here. (UI_Audit P3)
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/*
        * Le classement quotidien s'aligne sur la hauteur des marqueurs à sa
        * droite : la rangée est déjà à la hauteur du plus grand des deux, il
        * ne reste qu'à faire descendre la carte jusqu'en bas.
        */}
      <div className="order-1 lg:order-none lg:col-span-2 lg:h-full">
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

      {/*
        * La pile d'échanges se cale sur la hauteur du classement à sa
        * gauche : `relative` lui sert d'ancrage, `overflow-hidden` garantit
        * qu'elle ne le dépassera jamais.
        */}
      <div className="order-4 lg:order-none lg:relative lg:overflow-hidden">
        <HomeLatestTrade />
      </div>

      <div className="order-5 lg:order-none lg:col-span-2">
        <PlayoffWidget />
      </div>
    </div>
  );
}
