export default interface Echange {
  id: number;
  date: string;
  equipe_source_id: number;
  equipe_destination_id: number;
  equipe_source_nom: string;
  equipe_destination_nom: string;
  details: string;
  statut_confirmer: boolean;
}