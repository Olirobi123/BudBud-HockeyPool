// vitest est une dépendance du workspace racine, partagée avec les tests du serveur.
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, expect } from 'vitest';
import { fitCount } from '../tradeStackFit';

describe('fitCount', () => {
  it('renvoie 0 quand il n\'y a aucune carte', () => {
    expect(fitCount(500, [], 24)).toBe(0);
  });

  it('renvoie 1 tant que la hauteur du conteneur est inconnue', () => {
    expect(fitCount(0, [180, 180, 180], 24)).toBe(1);
    expect(fitCount(-1, [180, 180, 180], 24)).toBe(1);
  });

  it('garde toujours la carte la plus récente, même trop haute', () => {
    expect(fitCount(100, [180], 24)).toBe(1);
    expect(fitCount(100, [180, 180], 24)).toBe(1);
  });

  it('compte les cartes qui tiennent, espacement inclus', () => {
    // 180 + 24 + 180 = 384 <= 400, mais + 24 + 180 = 588 > 400
    expect(fitCount(400, [180, 180, 180], 24)).toBe(2);
  });

  it('accepte une pile qui remplit exactement le conteneur', () => {
    // 180 + 24 + 180 = 384
    expect(fitCount(384, [180, 180, 180], 24)).toBe(2);
  });

  it('refuse une carte qui dépasse d\'un seul pixel', () => {
    expect(fitCount(383, [180, 180, 180], 24)).toBe(1);
  });

  it('tient compte des hauteurs inégales', () => {
    // 120 + 24 + 300 = 444 > 400 → la deuxième carte ne tient pas
    expect(fitCount(400, [120, 300, 100], 24)).toBe(1);
    // 120 + 24 + 100 = 244, + 24 + 300 = 568 > 400
    expect(fitCount(400, [120, 100, 300], 24)).toBe(2);
  });

  it('ne dépasse jamais le nombre de cartes disponibles', () => {
    expect(fitCount(5000, [180, 180], 24)).toBe(2);
  });

  it('gère un espacement nul', () => {
    expect(fitCount(360, [180, 180, 180], 0)).toBe(2);
  });
});
