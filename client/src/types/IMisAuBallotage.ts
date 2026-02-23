export interface MisAuBallotage {
  id: number;
  annee: number;
  type_id: number;
  joueur_id: number | null;
  joueur_nom_libre: string | null;
  joueur_nom: string;
  equipe_id: number;
  equipe_nom: string;
  type_nom: string;
}
