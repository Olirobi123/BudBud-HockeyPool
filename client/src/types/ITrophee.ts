export interface TropheeGagnant {
  id: number;
  trophee_id: number;
  annee: number;
  equipe_id: number;
  trophee_nom: string;
  equipe_nom?: string;
}

export interface GroupedTrophee {
  trophee_nom: string;
  annees: number[];
  equipe_nom?: string;
}

export type TropheeType = 'Général' | 'Attaque' | 'Défense' | 'Gardien' | 'Playoffs';
