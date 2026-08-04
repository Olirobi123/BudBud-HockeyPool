import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Apply to `position: fixed` elements so they keep their width while a Radix
 * popover (Select, Dialog, Sheet) is open.
 *
 * Those popovers lock body scroll through `react-remove-scroll`, which sets
 * `overflow: hidden` on <body>. That removes the viewport scrollbar and widens
 * the viewport by the scrollbar's width, so the library compensates with
 * `margin-right: <scrollbar>px` on <body> and in-flow content stays put.
 * Fixed elements sit outside <body>'s box, never receive that compensation,
 * and silently grow by the scrollbar width every time a dropdown opens.
 *
 * `react-remove-scroll-bar` publishes this class name for exactly that case.
 * The matching rule only exists in the document while a lock is active, so the
 * class is inert the rest of the time.
 *
 * Mirrors `fullWidthClassName` from `react-remove-scroll-bar/constants` — a
 * transitive dependency of @radix-ui/react-select, hence the literal.
 *
 * @see https://github.com/theKashey/react-remove-scroll#usage-with-fixed-elements
 */
export const SCROLL_LOCK_FIXED_WIDTH = 'width-before-scroll-bar';

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fr-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatSeason(season?: number): string {
  if (!season) return '-';
  const str = String(season);
  if (str.length === 8) return `${str.slice(0, 4)}-${str.slice(4)}`;
  return str;
}

export function formatSeasonShort(season?: number): string {
  if (!season) return '-';
  const str = String(season);
  if (str.length === 8) return `${str.slice(0, 4)}-${str.slice(6)}`;
  return str;
}

export function formatAnnee(annee: number): string {
  return `${annee - 1}-${String(annee).slice(2)}`;
}

export function formatYearRanges(years: number[]): string {
  if (years.length === 0) return '';
  if (years.length === 1) return String(years[0]);

  const sorted = [...years].sort((a, b) => b - a);
  const ranges: string[] = [];
  let rangeStart = sorted[0];
  let rangeEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === rangeEnd - 1) {
      rangeEnd = sorted[i];
    } else {
      ranges.push(rangeStart === rangeEnd ? String(rangeStart) : `${rangeEnd}-${rangeStart}`);
      rangeStart = sorted[i];
      rangeEnd = sorted[i];
    }
  }
  ranges.push(rangeStart === rangeEnd ? String(rangeStart) : `${rangeEnd}-${rangeStart}`);

  return ranges.join(', ');
}

export function getPositionColor(position: string) {
  switch (position) {
    case 'C': return 'bg-blue-100 text-blue-800';
    case 'L': case 'R': return 'bg-green-100 text-green-800';
    case 'D': return 'bg-purple-100 text-purple-800';
    case 'G': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
