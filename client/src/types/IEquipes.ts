export interface TeamDraftPick {
  annee: number;
  round: number;
  equipe_source_nom: string | null;
}

export interface TeamDraftPicksResponse {
  annees: number[];
  picks: TeamDraftPick[];
}

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

export interface TeamPointsRanking {
  id: number;
  nom: string;
  division: string;
  rank: number;
  total_points: number;
  attaque_points: number;
  defense_points: number;
  gardien_points: number;
  total_matchs: number;
  attaque_matchs: number;
  defense_matchs: number;
  gardien_matchs: number;
}
