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
  }).format(date);
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
