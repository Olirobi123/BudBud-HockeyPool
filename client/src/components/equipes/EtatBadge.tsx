import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Flame, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EtatInfo } from '@/types/IEtat';
import { useMobileTooltip } from '@/hooks/useMobileTooltip';
import { BADGE_TOOLTIP_CLASS } from './badgeTooltipClass';

interface EtatBadgeProps {
  etat: EtatInfo;
  position: string;
}

function formatGameLine(game: EtatInfo['derniersMatchs'][number], isGoalie: boolean): string {
  const opp = game.opponentAbbrev ?? '?';
  if (isGoalie) {
    const pctg = game.savePctg !== undefined ? game.savePctg.toFixed(3) : '-';
    const shutout = game.goalsAgainst === 0 && (game.shotsAgainst ?? 0) > 0 ? ' BL' : '';
    return `vs ${opp}: ${game.decision ?? '-'} ${pctg}${shutout}`;
  }
  return `vs ${opp}: ${game.points ?? 0} pts`;
}

function formatSummary(etat: EtatInfo, isGoalie: boolean): string {
  if (isGoalie) {
    return `${etat.victoires5Matchs ?? 0} victoires, ${etat.blanchissages5Matchs ?? 0} blanchissages en 5 matchs`;
  }
  return `Total : ${etat.points5Matchs ?? 0} pts en 5 matchs`;
}

export function EtatBadge({ etat, position }: EtatBadgeProps) {
  const { open, setOpen, isMobile, handleClick } = useMobileTooltip();

  if (etat.etat === 'normal') return null;

  const isHot = etat.etat === 'hot';
  const isGoalie = position === 'G';

  const accentColor = isHot
    ? 'linear-gradient(to bottom, hsl(25 95% 53%), hsl(20 90% 48%), hsl(25 95% 53%))'
    : 'linear-gradient(to bottom, hsl(210 100% 56%), hsl(220 95% 50%), hsl(210 100% 56%))';
  const accentShadow = isHot
    ? '0 0 8px rgba(249, 115, 22, 0.5)'
    : '0 0 8px rgba(59, 130, 246, 0.5)';

  return (
    <TooltipPrimitive.Provider delayDuration={isMobile ? 0 : 200}>
      <TooltipPrimitive.Root open={open} onOpenChange={isMobile ? () => {} : setOpen}>
        <TooltipPrimitive.Trigger asChild onClick={handleClick}>
          <span className="inline-flex items-center shrink-0 cursor-default">
            {isHot ? (
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            ) : (
              <Snowflake className="w-3.5 h-3.5 text-blue-500" />
            )}
          </span>
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="center"
            sideOffset={6}
            className={BADGE_TOOLTIP_CLASS}
          >
            <div className="relative z-10 space-y-1.5">
              {/* Header */}
              <div className="flex items-center gap-1.5">
                {isHot ? (
                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                ) : (
                  <Snowflake className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                )}
                <span
                  className={cn(
                    'text-[10px] uppercase tracking-wider font-bold',
                    isHot ? 'text-orange-500' : 'text-blue-500',
                  )}
                >
                  {isHot ? 'En feu' : 'En froid'}
                </span>
              </div>

              {/* Per-game breakdown */}
              {etat.derniersMatchs.length > 0 && (
                <div className="space-y-0.5">
                  {etat.derniersMatchs.map((game, i) => (
                    // game index is the only stable key here
                    // eslint-disable-next-line react/no-array-index-key
                    <div key={i} className="text-xs text-muted-foreground">
                      {formatGameLine(game, isGoalie)}
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              <div
                className={cn(
                  'text-xs font-semibold pt-0.5 border-t border-muted/30',
                  isHot ? 'text-orange-500' : 'text-blue-500',
                )}
              >
                {formatSummary(etat, isGoalie)}
              </div>
            </div>

            {/* Accent bar */}
            <div
              className="absolute -left-4 top-0 bottom-0 w-1"
              style={{ background: accentColor, boxShadow: accentShadow }}
            />

            <TooltipPrimitive.Arrow
              className="fill-white/90 dark:fill-slate-900/90 drop-shadow-sm"
              width={12}
              height={6}
            />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
