/**
 * NHL goalie decision rules for a completed game, used by live points.
 *
 * Win: credited to the goalie in net when his team scored the game-winning goal —
 * the goal that put the winner one ahead of the loser's final total, not the last
 * goal of the game. A game decided in a shootout has no such goal, so the win goes
 * to the goalie in net for the shootout.
 *
 * Shutout: credited only to a goalie who played the whole game alone and allowed no
 * goal. A shutout shared by two goalies is credited to no one. Shootout goals don't
 * count, so a 0–0 game decided in a shootout gives both goalies a shutout.
 */

/** A play-by-play event, in game order. Goals exclude the shootout. */
export type GoalieTimelineEvent =
  | { kind: 'goalieInNet'; teamId: number; goalieId: number }
  | { kind: 'goal'; teamId: number };

/** One goalie's boxscore line. */
export interface BoxscoreGoalieLine {
  goalieId: number;
  teamId: number;
  seconds: number;
  decision?: string;
}

export interface GoalieDecisions {
  winningGoalieId: number | null;
  shutoutGoalieIds: number[];
}

const countGoals = (events: GoalieTimelineEvent[], teamId: number): number =>
  events.filter((e) => e.kind === 'goal' && e.teamId === teamId).length;

/**
 * Shutouts for a team that used exactly one goalie while its opponent scored no
 * (non-shootout) goal.
 */
const findShutouts = (
  goaliesByTeam: Map<number, Set<number>>,
  goalsByTeam: Map<number, number>,
  teamIds: [number, number],
): number[] => {
  const shutouts: number[] = [];
  for (const [teamId, opponentId] of [teamIds, [teamIds[1], teamIds[0]]]) {
    const goalies = goaliesByTeam.get(teamId);
    if (goalies?.size !== 1 || (goalsByTeam.get(opponentId) ?? 0) !== 0) continue;
    shutouts.push(...Array.from(goalies));
  }
  return shutouts;
};

/** Resolves the winning goalie and shutouts from an ordered play-by-play timeline. */
export const resolveGoalieDecisions = (
  events: GoalieTimelineEvent[],
  teamIds: [number, number],
  winningTeamId: number | null,
): GoalieDecisions => {
  const goaliesByTeam = new Map<number, Set<number>>();
  for (const e of events) {
    if (e.kind !== 'goalieInNet') continue;
    const goalies = goaliesByTeam.get(e.teamId) ?? new Set<number>();
    goalies.add(e.goalieId);
    goaliesByTeam.set(e.teamId, goalies);
  }
  const goalsByTeam = new Map(teamIds.map((id) => [id, countGoals(events, id)]));
  const shutoutGoalieIds = findShutouts(goaliesByTeam, goalsByTeam, teamIds);

  if (winningTeamId == null) return { winningGoalieId: null, shutoutGoalieIds };

  const losingTeamId = winningTeamId === teamIds[0] ? teamIds[1] : teamIds[0];
  const loserGoals = goalsByTeam.get(losingTeamId) ?? 0;
  const decidedInShootout = (goalsByTeam.get(winningTeamId) ?? 0) <= loserGoals;

  let goalieInNet: number | null = null;
  let winnerGoals = 0;
  let gwgScored = false;
  for (const e of events) {
    if (e.teamId !== winningTeamId) continue;
    if (e.kind === 'goalieInNet') {
      goalieInNet = e.goalieId;
      // GWG came before the winner's goalie faced any event: he's the one in net
      if (gwgScored) break;
    } else if (!decidedInShootout && !gwgScored && ++winnerGoals === loserGoals + 1) {
      gwgScored = true;
      if (goalieInNet != null) break;
    }
  }

  return { winningGoalieId: goalieInNet, shutoutGoalieIds };
};

/**
 * Resolves the winning goalie and shutouts from boxscore goalie lines. Uses the
 * NHL's own decision when present, else the winning team's goalie with the most TOI.
 */
export const resolveBoxscoreGoalieDecisions = (
  goalies: BoxscoreGoalieLine[],
  nonShootoutGoalsByTeam: Map<number, number>,
  teamIds: [number, number],
  winningTeamId: number | null,
): GoalieDecisions => {
  const played = goalies.filter((g) => g.seconds > 0);
  const goaliesByTeam = new Map<number, Set<number>>();
  for (const g of played) {
    const set = goaliesByTeam.get(g.teamId) ?? new Set<number>();
    set.add(g.goalieId);
    goaliesByTeam.set(g.teamId, set);
  }
  const shutoutGoalieIds = findShutouts(goaliesByTeam, nonShootoutGoalsByTeam, teamIds);

  if (winningTeamId == null) return { winningGoalieId: null, shutoutGoalieIds };

  const winners = played.filter((g) => g.teamId === winningTeamId);
  const winner = winners.find((g) => g.decision === 'W')
    ?? [...winners].sort((a, b) => b.seconds - a.seconds)[0];
  return { winningGoalieId: winner?.goalieId ?? null, shutoutGoalieIds };
};
