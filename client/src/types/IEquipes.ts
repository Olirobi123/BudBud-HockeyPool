export default interface Equipe {
  id: number;
  nom: string;
  active: boolean;
  division?: 'nord' | 'sud' | null;
}

export interface TeamStanding {
  id: number;
  nom: string;
  division: 'nord' | 'sud';
  rank: number; // Alphabetical position
}
