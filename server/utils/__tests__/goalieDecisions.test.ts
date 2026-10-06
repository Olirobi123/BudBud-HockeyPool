import { describe, expect, it } from 'vitest';
import {
  GoalieTimelineEvent,
  resolveBoxscoreGoalieDecisions,
  resolveGoalieDecisions,
} from '../goalieDecisions';

const OTT = 9;
const BOS = 6;
const TEAMS: [number, number] = [OTT, BOS];
const ULLMARK = 8476999;
const ERSSON = 8481035;
const SWAYMAN = 8480280;

const inNet = (teamId: number, goalieId: number): GoalieTimelineEvent =>
  ({ kind: 'goalieInNet', teamId, goalieId });
const goal = (teamId: number): GoalieTimelineEvent => ({ kind: 'goal', teamId });

describe('resolveGoalieDecisions (play-by-play)', () => {
  // OTT 4 – BOS 1, 2026-10-05: Ullmark 40 min / 0 GA, Ersson relief 20 min / 1 GA
  const ullmarkGame: GoalieTimelineEvent[] = [
    inNet(OTT, ULLMARK), inNet(BOS, SWAYMAN),
    goal(OTT), goal(OTT), goal(OTT), goal(OTT),
    inNet(OTT, ULLMARK),
    inNet(OTT, ERSSON), goal(BOS), inNet(OTT, ERSSON),
  ];

  it('credits the win to the goalie in net at the game-winning goal, not the last one', () => {
    expect(resolveGoalieDecisions(ullmarkGame, TEAMS, OTT).winningGoalieId).toBe(ULLMARK);
  });

  it('gives no shutout when the winning team used two goalies', () => {
    expect(resolveGoalieDecisions(ullmarkGame, TEAMS, OTT).shutoutGoalieIds).toEqual([]);
  });

  it('credits the relief goalie when the winning goal came on his watch', () => {
    const events = [
      inNet(OTT, ULLMARK), inNet(BOS, SWAYMAN), goal(BOS), goal(BOS),
      inNet(OTT, ERSSON), goal(OTT), goal(OTT), goal(OTT), inNet(OTT, ERSSON),
    ];
    expect(resolveGoalieDecisions(events, TEAMS, OTT).winningGoalieId).toBe(ERSSON);
  });

  it('uses the starter when the winning goal came before his first event', () => {
    const events = [goal(OTT), inNet(OTT, ULLMARK), inNet(BOS, SWAYMAN)];
    expect(resolveGoalieDecisions(events, TEAMS, OTT).winningGoalieId).toBe(ULLMARK);
  });

  it('credits a shutout to a lone goalie who allowed nothing', () => {
    const events = [inNet(OTT, ULLMARK), inNet(BOS, SWAYMAN), goal(OTT), inNet(OTT, ULLMARK)];
    expect(resolveGoalieDecisions(events, TEAMS, OTT)).toEqual({
      winningGoalieId: ULLMARK,
      shutoutGoalieIds: [ULLMARK],
    });
  });

  it('gives both goalies a shutout in a 0–0 game decided in a shootout', () => {
    const events = [inNet(OTT, ULLMARK), inNet(BOS, SWAYMAN), inNet(OTT, ULLMARK)];
    const result = resolveGoalieDecisions(events, TEAMS, OTT);
    expect(result.winningGoalieId).toBe(ULLMARK);
    expect(result.shutoutGoalieIds.sort()).toEqual([ULLMARK, SWAYMAN].sort());
  });

  it('credits the shootout win to the goalie in net for the shootout', () => {
    const events = [
      inNet(OTT, ULLMARK), inNet(BOS, SWAYMAN), goal(OTT), goal(BOS),
      inNet(OTT, ERSSON),
    ];
    expect(resolveGoalieDecisions(events, TEAMS, OTT).winningGoalieId).toBe(ERSSON);
  });
});

describe('resolveBoxscoreGoalieDecisions', () => {
  const lines = [
    { goalieId: ERSSON, teamId: OTT, seconds: 1200 },
    { goalieId: ULLMARK, teamId: OTT, seconds: 2400, decision: 'W' },
    { goalieId: SWAYMAN, teamId: BOS, seconds: 3600, decision: 'L' },
    { goalieId: 8480022, teamId: BOS, seconds: 0 },
  ];
  const goals = new Map([[OTT, 4], [BOS, 1]]);

  it('uses the NHL decision and withholds the combined shutout', () => {
    expect(resolveBoxscoreGoalieDecisions(lines, goals, TEAMS, OTT)).toEqual({
      winningGoalieId: ULLMARK,
      shutoutGoalieIds: [],
    });
  });

  it('falls back to most TOI when the decision is missing', () => {
    const noDecision = lines.map(({ decision: _decision, ...l }) => l);
    expect(resolveBoxscoreGoalieDecisions(noDecision, goals, TEAMS, OTT).winningGoalieId)
      .toBe(ULLMARK);
  });

  it('ignores a dressed backup with no ice time', () => {
    const solo = lines.filter((l) => l.teamId === BOS);
    const result = resolveBoxscoreGoalieDecisions(solo, new Map([[OTT, 0], [BOS, 2]]), TEAMS, BOS);
    expect(result.shutoutGoalieIds).toEqual([SWAYMAN]);
  });
});
