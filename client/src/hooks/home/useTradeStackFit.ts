import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { fitCount } from '@/lib/tradeStackFit';

/** Le point de rupture `lg` de Tailwind : en dessous, il n'y a plus de tableau à égaler. */
const DESKTOP_QUERY = '(min-width: 1024px)';

/** Doit rester aligné sur le `gap-6` de la pile. */
const STACK_GAP_PX = 24;

interface TradeStackFit {
  /** La colonne mesurée — sa hauteur est celle du tableau voisin. */
  containerRef: React.RefObject<HTMLDivElement>;
  /** La copie invisible qui donne la hauteur naturelle de chaque carte. */
  ghostRef: React.RefObject<HTMLDivElement>;
  isDesktop: boolean;
  visibleCount: number;
}

/**
 * Combien de cartes d'échange afficher pour remplir la colonne sans la
 * dépasser.
 *
 * Les cartes visibles s'étirent pour occuper l'espace restant, donc leur
 * hauteur ne dit plus rien de leur contenu : les hauteurs naturelles viennent
 * d'une copie invisible, hors flux, de toutes les cartes candidates.
 */
// eslint-disable-next-line import/prefer-default-export
export function useTradeStackFit(tradeCount: number): TradeStackFit {
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(tradeCount, 1));

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const ghost = ghostRef.current;

    if (!isDesktop || !container || !ghost) {
      setVisibleCount(Math.min(tradeCount, 1));
      return;
    }

    const heights = Array.from(ghost.children).map(
      (card) => card.getBoundingClientRect().height,
    );
    setVisibleCount(
      fitCount(container.getBoundingClientRect().height, heights, STACK_GAP_PX),
    );
  }, [isDesktop, tradeCount]);

  useLayoutEffect(() => {
    measure();

    const container = containerRef.current;
    const ghost = ghostRef.current;
    if (!container || !ghost) return undefined;

    // La colonne bouge quand le tableau voisin change de taille, la copie
    // invisible quand la largeur ou les échanges changent.
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(ghost);
    return () => observer.disconnect();
  }, [measure]);

  return {
    containerRef, ghostRef, isDesktop, visibleCount,
  };
}
