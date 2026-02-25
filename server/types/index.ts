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
  division?: string;
  dg_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Echange {
  id: number;
  date: Date;
  equipe_source_id: number;
  equipe_destination_id: number;
  statut_confirmer: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface EchangeWithTeams extends Echange {
  equipe_source_nom: string;
  equipe_destination_nom: string;
  joueurs_source: string[];
  joueurs_destination: string[];
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

// Types pour les trophées
export interface Trophee {
  id: number;
  nom: string;
}

export interface TropheeGagnant {
  id: number;
  trophee_id: number;
  annee: number;
  equipe_id: number;
}

export interface TropheeGagnantWithDetails extends TropheeGagnant {
  trophee_nom: string;
  equipe_nom?: string;
}

// Types pour la page d'accueil
export interface HomeTradeResponse {
  id: string;
  date: string;
  teamA: string;
  playersA: string[];
  teamB: string;
  playersB: string[];
}

// Mis au ballotage (joueurs retirés avant draft/ballotage)
export interface MisAuBallotage {
  id: number;
  annee: number;
  type_id: number;
  joueur_id: number | null;
  joueur_nom_libre: string | null;
}

export interface MisAuBallotageWithDetails extends MisAuBallotage {
  joueur_nom: string;
  equipe_id: number;
  equipe_nom: string;
  type_nom: string;
}

// Equipe Points (classement)
export interface EquipePoints {
  id: number;
  equipe_id: number;
  season: string;
  attaque_points: number;
  defense_points: number;
  gardien_points: number;
  total_points: number;
  last_update_at?: Date;
}

export interface EquipePointsWithTeam extends EquipePoints {
  equipe_nom: string;
  division?: string;
  dg_name?: string;
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
  shutouts: number;
}

// Roster player with NHL stats
export interface RosterPlayerWithStats extends Joueur {
  nhlStats: SkaterStats | GoalieStats | null;
  teamLogo?: string;
  isActive?: boolean;
}

// Live Points types
export interface LivePlayerPoints {
  nhlPlayerId: number;
  firstName: string;
  lastName: string;
  position: string;
  nhlTeamAbbrev: string;
  nhlTeamLogo: string;
  headshot: string;
  goals: number;
  assists: number;
  points: number;
  poolTeam?: {
    id: number;
    nom: string;
  };
}

export interface LiveTeamPoints {
  equipeId: number;
  equipeNom: string;
  totalPoints: number;
  totalGoals: number;
  totalAssists: number;
  attaquePoints: number;
  defensePoints: number;
  players: LivePlayerPoints[];
}

export interface LivePointsResponse {
  topPlayers: LivePlayerPoints[];
  teamLeaderboard: LiveTeamPoints[];
  gamesCount: number;
  liveGamesCount: number;
}

export interface EspnAthleteEntry {
  athlete: {
    firstName: string;
    lastName: string;
  };
  status: string;
  details?: {
    type?: string;
    returnDate?: string;
    shortComment?: string;
  };
}

export interface EspnTeamInjuries {
  team: { displayName: string };
  injuries: EspnAthleteEntry[];
}

export interface EspnInjuriesResponse {
  injuries: EspnTeamInjuries[];
}

export interface RepechageChoice {
  annee: number;
  type_id: number;
  rang: number;
  round: number;
  nom: string;
  joueur: string;
}

export interface RepechageType {
  id: number;
  nom: string;
}

export interface TeamDraftPick {
  annee: number;
  round: number;
  equipe_source_nom: string | null;
}

export interface InjuryInfo {
  nhlPlayerId: number;
  statut: string;
  typeBlessure: string | null;
  commentaire: string | null;
  dateRetour: string | null;
  lastUpdate: string;
}
