export type PageToken = number | 'ellipsis-start' | 'ellipsis-end';

/** Pages à afficher : première, dernière, courante ± 1, avec des ellipses entre les trous. */
// eslint-disable-next-line import/prefer-default-export
export function getPageWindow(current: number, total: number): PageToken[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const tokens: PageToken[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) tokens.push('ellipsis-start');
  for (let p = start; p <= end; p += 1) tokens.push(p);
  if (end < total - 1) tokens.push('ellipsis-end');
  tokens.push(total);
  return tokens;
}
