import { JSX } from 'react';
import { EchangeCard } from '@/components/echanges/EchangeCard';
import { useTradeStackFit } from '@/hooks/home/useTradeStackFit';
import type { HomeTrade } from '@/types/IHome';
import type Echange from '@/types/IEchange';

/*
 * La colonne des échanges vit à côté du classement, qui est bien plus haut
 * qu'une seule transaction. Plutôt que de laisser un trou en bas à droite, on
 * empile autant d'échanges récents que la colonne peut en loger — jamais une
 * carte tronquée, jamais plus haut que le tableau — et les cartes retenues
 * s'étirent pour que la dernière finisse exactement au ras du tableau.
 *
 * En dessous de `lg` la grille repasse sur une colonne : il n'y a plus rien à
 * égaler, et on s'en tient au dernier échange.
 */

function toEchange(trade: HomeTrade): Echange {
  return {
    id: parseInt(trade.id, 10),
    date: trade.date,
    equipe_source_id: 0,
    equipe_destination_id: 0,
    equipe_source_nom: trade.teamA,
    equipe_destination_nom: trade.teamB,
    joueurs_source: trade.playersA,
    joueurs_destination: trade.playersB,
    statut_confirmer: true,
  };
}

interface HomeTradeStackProps {
  trades: HomeTrade[];
}

// eslint-disable-next-line import/prefer-default-export
export function HomeTradeStack({ trades }: HomeTradeStackProps): JSX.Element {
  const {
    containerRef, ghostRef, isDesktop, visibleCount,
  } = useTradeStackFit(trades.length);

  return (
    <div ref={containerRef} className="relative flex flex-col gap-6 lg:h-full">
      {isDesktop && trades.length > 1 && (
        <div
          ref={ghostRef}
          aria-hidden
          className="invisible pointer-events-none absolute inset-x-0 top-0"
        >
          {trades.map((trade) => (
            <EchangeCard key={trade.id} echange={toEchange(trade)} />
          ))}
        </div>
      )}

      {trades.slice(0, visibleCount).map((trade, index) => (
        <EchangeCard
          key={trade.id}
          echange={toEchange(trade)}
          stretch={isDesktop}
          animationDelay={`${index * 60}ms`}
        />
      ))}
    </div>
  );
}
