export interface HistoireEchangeEvent {
  type: 'echange';
  sort_date: string;
  id: number;
  date: string;
  statut_confirmer: boolean;
  equipe_source_id: number;
  equipe_source_nom: string;
  equipe_destination_id: number;
  equipe_destination_nom: string;
  joueurs_source: string[];
  joueurs_destination: string[];
}

export interface HistoireRepechageEvent {
  type: 'repechage';
  sort_date: string;
  id: number;
  annee: number;
  round: number | null;
  rang: number;
  equipe_id: number;
  equipe_nom: string;
  type_id: number;
  type_nom: string;
}

export interface HistoireBallotageEvent {
  type: 'ballotage';
  sort_date: string;
  id: number;
  annee: number;
  equipe_id: number;
  equipe_nom: string;
  type_id: number;
  type_nom: string;
}

export type HistoireEvent = HistoireEchangeEvent | HistoireRepechageEvent | HistoireBallotageEvent;

export interface PlayerHistoryResponse {
  joueur_id: number | null;
  events: HistoireEvent[];
}
