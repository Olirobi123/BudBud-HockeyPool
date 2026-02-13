import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamDGTooltipProps {
  dgName: string | null | undefined;
  children: React.ReactNode;
  division?: 'nord' | 'sud' | null;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export function TeamDGTooltip({
  dgName,
  children,
  division,
  side = 'top',
  align = 'center',
}: TeamDGTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setOpen(!open);
    }
  };

  const displayName = dgName || 'Non disponible';

  // Division-specific colors
  const colors = division === 'sud'
    ? {
        primary: 'hsl(6 78% 57%)',      // Sud red/orange
        light: 'hsl(6 78% 67%)',
        gradient: 'from-red-500/10 via-transparent to-orange-500/10',
        text: 'text-red-600 dark:text-red-400',
        glow: 'rgba(239, 68, 68, 0.5)',
        glowBright: 'rgba(239, 68, 68, 0.3)',
      }
    : {
        primary: 'hsl(217 91% 60%)',    // Nord blue
        light: 'hsl(217 91% 70%)',
        gradient: 'from-blue-500/10 via-transparent to-cyan-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        glow: 'rgba(59, 130, 246, 0.5)',
        glowBright: 'rgba(59, 130, 246, 0.3)',
      };


  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild onClick={handleClick}>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={8}
            className={cn(
              // Glass-morphism base
              'relative overflow-hidden rounded-xl',
              'bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-800/90',
              'backdrop-blur-xl',

              // Borders and shadows for depth
              'border border-white/20 dark:border-white/10',
              'shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',

              // Subtle inner glow
              'before:absolute before:inset-0 before:rounded-xl',
              `before:bg-gradient-to-br before:${colors.gradient}`,
              'before:pointer-events-none',

              // Animation with spring effect
              'animate-in fade-in-0 zoom-in-95 duration-200',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
              'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',

              // Sizing
              'px-4 py-3 max-w-xs',

              // Z-index to appear above other content
              'z-50'
            )}
          >
            <div className="relative z-10">
           

              {/* Label */}
              <div className="flex items-center gap-1.5 mb-1">
                <UserCircle className={cn('w-3.5 h-3.5', colors.text)} />
                <span
                  className={cn('text-[10px] uppercase tracking-wider font-bold', colors.text)}
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.1em' }}
                >
                  Directeur Général
                </span>
              </div>

              {/* DG Name */}
              <div
                className="text-sm leading-snug font-normal text-foreground/80"
              >
                {displayName}
              </div>

              {/* Decorative accent bar with subtle pulse */}
              <div
                className="absolute -left-4 top-0 bottom-0 w-1 transition-all duration-300"
                style={{
                  background: division === 'sud'
                    ? 'linear-gradient(to bottom, hsl(6 78% 57%), hsl(14 90% 65%), hsl(6 78% 57%))'
                    : 'linear-gradient(to bottom, hsl(217 91% 60%), hsl(189 94% 43%), hsl(217 91% 60%))',
                  boxShadow: open
                    ? `0 0 12px ${colors.glowBright}, 0 0 4px ${colors.glow}`
                    : `0 0 8px ${colors.glow}`,
                }}
              />

              {/* Subtle corner accent */}
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full opacity-5"
                style={{
                  background: `radial-gradient(circle, ${colors.primary} 0%, transparent 70%)`,
                }}
              />
            </div>

            {/* Arrow */}
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
