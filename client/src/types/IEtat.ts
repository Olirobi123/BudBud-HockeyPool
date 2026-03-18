export interface Last5GameSnapshot {
  gameDate?: string;
  opponentAbbrev?: string;
  goals?: number;
  assists?: number;
  points?: number;
  savePctg?: number;
  shotsAgainst?: number;
  goalsAgainst?: number;
  decision?: string;
}

export interface EtatInfo {
  nhlPlayerId: number;
  etat: 'hot' | 'cold' | 'normal';
  points5Matchs: number | null;
  victoires5Matchs: number | null;
  blanchissages5Matchs: number | null;
  savePctg5Matchs: number | null;
  derniersMatchs: Last5GameSnapshot[];
  lastUpdate: string;
}
