import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface StatTooltipProps {
  description: string;
  children: React.ReactNode;
}

export function StatTooltip({ description, children }: StatTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.stopPropagation();
      setOpen((v) => !v);
    }
  };

  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root open={open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild onClick={handleClick}>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            align="center"
            sideOffset={6}
            className="z-50 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs font-medium text-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          >
            {description}
            <TooltipPrimitive.Arrow className="fill-border" width={10} height={5} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
