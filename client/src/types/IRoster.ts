export interface Joueur {
  id: number;
  nhl_player_id: number;
  nom: string;
  prenom: string;
  position: string;
}

export interface SkaterStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
}

export interface GoalieStats {
  gamesPlayed: number;
  savePctg: number;
  goalsAgainstAvg: number;
  wins: number;
  shutouts: number;
}

export interface RosterPlayerWithStats extends Joueur {
  nhlStats: SkaterStats | GoalieStats | null;
  teamLogo?: string;
  isActive?: boolean;
}

// Type guards
export function isGoalieStats(stats: SkaterStats | GoalieStats): stats is GoalieStats {
  return 'savePctg' in stats;
}

export function isSkaterStats(stats: SkaterStats | GoalieStats): stats is SkaterStats {
  return 'goals' in stats;
}
