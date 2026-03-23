import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
