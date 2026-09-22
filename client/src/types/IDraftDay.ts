export interface DraftDayFlag {
  actif: boolean;
  /** Année du draft en cours, convention `repechages.annee` (oct. 2026 → 2027). */
  annee: number;
}

export interface DraftBoardPick {
  rang: number;
  round: number;
  pickInRound: number;
  equipeId: number;
  equipeNom: string;
  equipeNomCourt: string | null;
  /** Équipe d'origine quand le choix a été échangé. */
  sourceNom: string | null;
  sourceNomCourt: string | null;
  joueur: string | null;
  joueurNhlId: number | null;
  joueurPosition: string | null;
}

export interface ListeClassement {
  id: number;
  nom: string;
  auteur: string | null;
  publieLe: string | null;
  total: number;
}

export interface ListeClassementJoueur {
  rang: number;
  nom: string;
  position: string;
  equipeNhl: string | null;
  tier: string | null;
  nhlPlayerId: number | null;
  proprietaire: { id: number; nom: string } | null;
}

/** F = attaquants (C, LW, RW). */
export type ListePositionFilter = 'ALL' | 'F' | 'D' | 'G';
export type ListeOwnershipFilter = 'ALL' | 'AVAILABLE' | 'OWNED';
