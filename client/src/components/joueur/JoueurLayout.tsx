import Layout from '@/components/Layout';
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
    <Layout>
      <JoueurHeader player={player} />
      <JoueurTabs player={player}>
        <JoueurTabsOverview player={player} />
        <JoueurTabsLastFive player={player} />
        <JoueurTabsStats player={player} />
      </JoueurTabs>
    </Layout>
  );
}
