import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Hospital } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InjuryInfo } from '@/types/IInjury';

interface InjuryBadgeProps {
  injury: InjuryInfo;
}

export function InjuryBadge({ injury }: InjuryBadgeProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = React.useRef('ontouchstart' in window || navigator.maxTouchPoints > 0).current;

  // On mobile, close tooltip when tapping outside
  React.useEffect(() => {
    if (!isMobile || !open) return;
    const handleOutside = () => setOpen(false);
    document.addEventListener('pointerdown', handleOutside, { once: true });
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [isMobile, open]);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setOpen((prev) => !prev);
    }
  };

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
            className={cn(
              'relative overflow-hidden rounded-xl',
              'bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-800/90',
              'backdrop-blur-xl',
              'border border-white/20 dark:border-white/10',
              'shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
              'px-4 py-3 max-w-xs z-50'
            )}
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
                    {new Date(injury.dateRetour).toLocaleDateString('fr-CA', {
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
