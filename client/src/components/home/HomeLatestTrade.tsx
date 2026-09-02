import { JSX } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useRecentTrades } from '@/hooks/home/useRecentTrades';
import { InlineError } from '@/components/ui/error-display';
import { HomeLatestTradeSkeleton } from './latest-trade/HomeLatestTradeSkeleton';
import { HomeTradeStack } from './latest-trade/HomeTradeStack';

/**
 * De quoi remplir la colonne dans le pire des cas ; la pile n'en affiche que
 * ce qui tient.
 */
const TRADES_FETCHED = 4;

// eslint-disable-next-line import/prefer-default-export
export function HomeLatestTrade(): JSX.Element {
  const { data: trades, isLoading, error } = useRecentTrades(TRADES_FETCHED);

  /*
   * Hors flux sur grand écran : la colonne ne pèse alors plus rien dans le
   * calcul de la hauteur de la rangée, qui revient au tableau voisin — c'est
   * lui, et lui seul, qui donne sa hauteur à la pile.
   */
  const shell = 'lg:absolute lg:inset-0';

  if (isLoading) {
    return <div className={shell}><HomeLatestTradeSkeleton /></div>;
  }

  if (error) {
    return (
      <div className={shell}>
        <InlineError message="Erreur lors du chargement des derniers échanges." />
      </div>
    );
  }

  if (!trades || trades.length === 0) {
    return (
      <div className={`${shell} flex flex-col items-center justify-center py-10 text-center`}>
        <ArrowLeftRight className="w-10 h-10 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">Aucun échange récent.</p>
      </div>
    );
  }

  return <div className={shell}><HomeTradeStack trades={trades} /></div>;
}
