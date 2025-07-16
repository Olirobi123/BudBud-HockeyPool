export interface NHLPlayer {
  playerId: string;
  name: string;
  positionCode: string;
  teamAbbrev: string;
  lastTeamId: string;
  lastTeamAbbrev: string;
  sweaterNumber: number;
  active: boolean;
}

export default interface PlayerDetails {
  playerId: number;
  isActive: boolean;
  currentTeamId: number;
  currentTeamAbbrev: string;
  fullTeamName: { default: string; fr: string };
  firstName: { default: string };
  lastName: { default: string };
  sweaterNumber: number;
  position: string;
  headshot: string;
  heroImage: string;
  teamLogo: string;
  heightInInches: number;
  heightInCentimeters: number;
  weightInPounds: number;
  weightInKilograms: number;
  birthDate: string;
  birthCity: { default: string };
  birthStateProvince: { default: string };
  birthCountry: string;
  shootsCatches: string;
  draftDetails: {
    year: number;
    teamAbbrev: string;
    round: number;
    pickInRound: number;
    overallPick: number;
  };
  featuredStats?: {
    season: number;
    regularSeason: {
      subSeason: {
        assists: number;
        goals: number;
        points: number;
        gamesPlayed: number;
        plusMinus: number;
        powerPlayGoals: number;
        powerPlayPoints: number;
        shots: number;
        // Stats de gardien
        wins?: number;
        losses?: number;
        otLosses?: number;
        shutouts?: number;
        savePctg?: number;
        goalsAgainstAvg?: number;

      };
    };
  };
  last5Games?: Array<{
    gameDate: string;
    goals: number;
    assists: number;
    points: number;
    plusMinus: number;
    shots: number;
    opponentAbbrev: string;
    homeRoadFlag: string;
    toi: string;
    // Stats de gardien
    decision?: string;
    gamesStarted?: number;
    goalsAgainst?: number;
    penaltyMins?: number;
    savePctg?: number;
    shotsAgainst?: number;
  }>;
  seasonTotals: Array<{
    assists: number;
    goals: number;
    points: number;
    gamesPlayed: number;
    leagueAbbrev: string;
    season: number;
    teamName: {
      default: string;
    };
    gameTypeId?: number;
    // Stats de gardien
    wins?: number;
    losses?: number;
    otLosses?: number;
    shutouts?: number;
    savePctg?: number;
    goalsAgainstAvg?: number;
    timeOnIce?: string;
  }>;
}
