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
  players: LivePlayerPoints[];
}

export interface LivePointsResponse {
  topPlayers: LivePlayerPoints[];
  teamLeaderboard: LiveTeamPoints[];
  gamesCount: number;
  liveGamesCount: number;
}
