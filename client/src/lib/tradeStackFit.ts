/**
 * Combien de cartes de tête tiennent dans une hauteur donnée.
 *
 * La pile d'échanges de la page d'accueil doit remplir la colonne sans jamais
 * dépasser le tableau voisin : on garde le plus long préfixe de cartes qui
 * entre dans `containerHeight`, espacement compris, et on n'affiche jamais de
 * carte tronquée.
 *
 * La carte la plus récente est toujours conservée — tant que la mesure n'a pas
 * eu lieu (`containerHeight` à 0) ou que la colonne est plus courte qu'une
 * seule carte, la page montre le dernier échange plutôt que rien.
 */
// eslint-disable-next-line import/prefer-default-export
export function fitCount(containerHeight: number, cardHeights: number[], gap: number): number {
  if (cardHeights.length === 0) return 0;
  if (containerHeight <= 0) return 1;

  let used = cardHeights[0];
  let count = 1;

  for (let i = 1; i < cardHeights.length; i += 1) {
    const next = used + gap + cardHeights[i];
    if (next > containerHeight) break;
    used = next;
    count += 1;
  }

  return count;
}
