/**
 * Pool scoring rules — single source of truth for all points calculations.
 * Used by pointsService, teamsService, and livePointsService.
 */

export const FORWARD_POSITIONS = ['C', 'L', 'R'];
export const MAX_ACTIVE_FORWARDS = 12;
export const MAX_ACTIVE_DEFENSEMEN = 6;
export const MAX_ACTIVE_GOALIES = 2;

/** Pool points for a goalie: 2 per win + 3 per shutout */
export const calculateGoaliePoints = (wins: number, shutouts: number): number =>
  wins * 2 + shutouts * 3;
