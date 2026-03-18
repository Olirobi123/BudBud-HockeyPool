/**
 * Shared glass-morphism className for badge tooltip content (InjuryBadge, EtatBadge).
 */
export const BADGE_TOOLTIP_CLASS = [
  'relative overflow-hidden rounded-xl',
  'bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-900/95 dark:to-slate-800/90',
  'backdrop-blur-xl',
  'border border-white/20 dark:border-white/10',
  'shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
  'animate-in fade-in-0 zoom-in-95 duration-200',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150',
  'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
  'px-4 py-3 max-w-xs z-50',
].join(' ');
