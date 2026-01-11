export interface DraftPick {
  annee: number;
  type_id: number;
  rang: number;
  round: number;
  nom: string;
  joueur: string;
}

export interface DraftType {
  id: number;
  nom: string;
}
