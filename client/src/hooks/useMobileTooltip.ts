import * as React from 'react';

/**
 * Shared tooltip state for badge components.
 * On mobile (touch device), the tooltip is toggled on tap and dismissed on outside tap.
 * On desktop, Radix manages open/close via hover.
 */
export function useMobileTooltip() {
  const [open, setOpen] = React.useState(false);
  const isMobile = React.useRef('ontouchstart' in window || navigator.maxTouchPoints > 0).current;

  React.useEffect(() => {
    if (!isMobile || !open) return undefined;
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

  return { open, setOpen, isMobile, handleClick };
}
