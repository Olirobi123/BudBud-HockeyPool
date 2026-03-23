import { HistoireEvent } from '@/types/IHistoire';
import PlayerDetails from '@/types/IPlayerDetails';
import TradeEventItem from './TradeEventItem';
import DraftEventItem from './DraftEventItem';
import BallotageEventItem from './BallotageEventItem';

type Props = {
  event: HistoireEvent;
  player: PlayerDetails;
};

export default function HistoireEventItem({ event, player }: Props) {
  if (event.type === 'echange') return <TradeEventItem event={event} player={player} />;
  if (event.type === 'repechage') return <DraftEventItem event={event} player={player} />;
  return <BallotageEventItem event={event} player={player} />;
}
