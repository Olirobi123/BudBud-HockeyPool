// Types principaux pour le backend

// Re-export NHL API client types for consistency
export type {
  PlayerStatsResponse,
  PlayerSearchResult,
  PlayerSearchResponse,
} from '@olirobi/nhl_api_client';

export interface Equipe {
  id: number;
  nom: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Echange {
  id: number;
  date: Date;
  details: string;
  equipe_source_id: number;
  equipe_destination_id: number;
  statut_confirmer: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface EchangeWithTeams extends Echange {
  equipe_source_nom: string;
  equipe_destination_nom: string;
}

export interface Player {
  id: number;
  nom: string;
  prenom: string;
  position: string;
  equipe_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface RepechageData {
  id: number;
  joueur_id: number;
  equipe_id: number;
  round: number;
  pick: number;
  year: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Joueur {
  id: number;
  nhl_player_id: number;
  nom: string;
  prenom: string;
  position: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EquipeJoueur {
  id: number;
  equipe_id: number;
  joueur_id: number;
}

// Types pour les requêtes API
export interface CreateEchangeRequest {
  equipe_source_id: string;
  equipe_destination_id: string;
  details: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Types pour les erreurs
export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// Types pour la page d'accueil
export interface HomeActivityItem {
  id: string;
  type: 'trade';
  time: string;
  description: string;
  details?: string;
}

export interface HomeTradeResponse {
  id: string;
  date: string;
  teamA: string;
  playersA: string[];
  teamB: string;
  playersB: string[];
}

// Stats for skaters (C, LW, RW, D)
export interface SkaterStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
}

// Stats for goalies (G)
export interface GoalieStats {
  gamesPlayed: number;
  savePctg: number;
  goalsAgainstAvg: number;
  wins: number;
}

// Roster player with NHL stats
export interface RosterPlayerWithStats extends Joueur {
  nhlStats: SkaterStats | GoalieStats | null;
}
