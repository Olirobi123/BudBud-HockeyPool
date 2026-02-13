export default interface Equipe {
  id: number;
  nom: string;
  active: boolean;
  division?: 'nord' | 'sud' | null;
  dg_name? : string;
}

export interface TeamStanding {
  id: number;
  nom: string;
  division: 'nord' | 'sud';
  rank: number;
  total_points: number;
  dg_name?: string;
}
