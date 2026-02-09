export interface Trophee {
  id: number;
  nom: string;
}

export interface TropheeGagnant {
  id: number;
  trophee_id: number;
  annee: number;
  equipe_id: number;
  trophee_nom: string;
  equipe_nom?: string;
}

export type TropheeType = 'Général' | 'Attaque' | 'Défense' | 'Gardien' | 'Playoffs';
