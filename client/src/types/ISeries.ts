export interface SeriesTeamWeek {
  equipe_id: number;
  equipe_nom: string;
  division: string;
  total_points: number;
  total_matchs: number;
  attaque_points: number;
  defense_points: number;
  gardien_points: number;
  ppg: number; // total_points / total_matchs (tiebreaker 1)
}

export interface SeriesMatchup {
  id: number;
  saison: string;
  ronde: 1 | 2 | 3;
  division: string | null;
  position: number;
  equipe_a_id: number | null;
  equipe_b_id: number | null;
  gagnant_id: number | null;
  equipe_a_nom?: string;
  equipe_b_nom?: string;
  gagnant_nom?: string;
  equipeA?: SeriesTeamWeek;
  equipeB?: SeriesTeamWeek;
}

export interface SeriesData {
  saison: string;
  quartsDeFinale: SeriesMatchup[];
  demiFinales: SeriesMatchup[];
  finale: SeriesMatchup | null;
  rondeActive: 1 | 2 | 3 | null;
  weekPoints: Record<string, SeriesTeamWeek[]>;
}
