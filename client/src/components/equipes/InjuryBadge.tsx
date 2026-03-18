import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Hospital } from 'lucide-react';
import { InjuryInfo } from '@/types/IInjury';
import { useMobileTooltip } from '@/hooks/useMobileTooltip';
import { BADGE_TOOLTIP_CLASS } from './badgeTooltipClass';

interface InjuryBadgeProps {
  injury: InjuryInfo;
}

export function InjuryBadge({ injury }: InjuryBadgeProps) {
  const { open, setOpen, isMobile, handleClick } = useMobileTooltip();

  return (
    <TooltipPrimitive.Provider delayDuration={isMobile ? 0 : 200}>
      {/* On mobile, block Radix from closing via pointerleave — we manage state ourselves */}
      <TooltipPrimitive.Root open={open} onOpenChange={isMobile ? () => {} : setOpen}>
        <TooltipPrimitive.Trigger asChild onClick={handleClick}>
          <span className="inline-flex items-center shrink-0 cursor-default">
            <Hospital className="w-3.5 h-3.5 text-red-500" />
          </span>
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="center"
            sideOffset={6}
            className={BADGE_TOOLTIP_CLASS}
          >
            <div className="relative z-10 space-y-1">
              {/* Status */}
              <div className="flex items-center gap-1.5">
                <Hospital className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-red-500">
                  {injury.statut}
                </span>
              </div>

              {/* Body part */}
              {injury.typeBlessure && (
                <div className="text-sm font-medium text-foreground/90">
                  {injury.typeBlessure}
                </div>
              )}

              {/* Comment */}
              {injury.commentaire && (
                <div className="text-xs text-muted-foreground leading-snug">
                  {injury.commentaire}
                </div>
              )}

              {/* Return date */}
              {injury.dateRetour && (
                <div className="text-xs text-muted-foreground">
                  Retour prévu :{' '}
                  <span className="font-medium text-foreground/80">
                    {new Date(`${injury.dateRetour}T12:00:00`).toLocaleDateString('fr-CA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Red accent bar */}
            <div
              className="absolute -left-4 top-0 bottom-0 w-1"
              style={{
                background:
                  'linear-gradient(to bottom, hsl(0 84% 60%), hsl(0 72% 51%), hsl(0 84% 60%))',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
              }}
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
