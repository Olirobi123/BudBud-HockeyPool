const LABELS: Record<string, string> = {
  C: 'Att',
  LW: 'Att',
  RW: 'Att',
  F: 'Att',
  D: 'Déf',
  G: 'Gar',
};

/**
 * Libellé court d'une position dans les listes de classement : attaquant, défenseur ou gardien.
 * Le détail centre/ailier n'est pas retenu — une liste publique donne souvent « F » tout court.
 */
// eslint-disable-next-line import/prefer-default-export
export function getPositionLabel(position: string): string {
  return LABELS[position] ?? position;
}
