export interface DraftPick {
  annee: number;
  type_id: number;
  rang: number;
  round: number;
  nom: string;
  // NULL tant que le choix du draft en cours n'a pas été fait.
  joueur: string | null;
}

export interface DraftType {
  id: number;
  nom: string;
}
