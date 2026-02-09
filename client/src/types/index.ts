export type { default as Equipe } from './IEquipes';
export type { default as Echange } from './IEchange';
export type { default as PlayerDetails, NHLPlayer } from './IPlayerDetails';
export type { HomeActivity, HomeTrade } from './IHome';
export type { DraftPick, DraftType } from './IDraft';
export type {
  GameScore, TeamWithScore, GameClock, Period, ScoreResponse,
} from './IScores';
export type { Joueur, RosterPlayerWithStats, SkaterStats, GoalieStats } from './IRoster';
export { isGoalieStats, isSkaterStats } from './IRoster';
export type { Trophee, TropheeGagnant, TropheeType } from './ITrophee';
