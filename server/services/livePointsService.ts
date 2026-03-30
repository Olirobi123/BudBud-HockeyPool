import { NHLClient, PlayByPlayResponse, GameScore } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import { QUERIES } from '../models';
import { LivePlayerPoints, LiveTeamPoints, LivePointsResponse } from '../types';
import { scoresService } from './scoresService';
import { calculateGoaliePoints, GOALIE_POSITION, DEFENSE_POSITION } from '../utils/poolRules';

const ACTIVE_GAME_STATES = ['LIVE', 'CRIT', 'FINAL', 'OFF'];
const TOP_PLAYERS_LIMIT = 10;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface PlayerAccumulator {
  nhlPlayerId: number;
  firstName: string;
  lastName: string;
  position: string;
  nhlTeamAbbrev: string;
  nhlTeamLogo: string;
  headshot: string;
  goals: number;
  assists: number;
  wins: number;
  shutouts: number;
  goalsAgainst: number;
}

interface OwnershipRow {
  nhl_player_id: number;
  nom: string;
  prenom: string;
  position: string;
  compte_points: boolean;
  equipe_id: number | null;
  equipe_nom: string | null;
}

export class LivePointsService {
  private nhlClient: NHLClient;

  private cachedResponse: LivePointsResponse | null = null;

  private cacheExpiry = 0;

  constructor() {
    this.nhlClient = new NHLClient();
  }

  /** Main entry point. Returns live pool points from play-by-play or the nightly snapshot. */
  async getLivePoints(useCache = true, isSnapshotCall = false): Promise<LivePointsResponse> {
    if (useCache && this.cachedResponse && Date.now() < this.cacheExpiry) {
      return this.cachedResponse;
    }

    let scoresResult: Awaited<ReturnType<typeof scoresService.getCurrentScores>>;
    try {
      scoresResult = await scoresService.getCurrentScores();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('NHL scores API unavailable, falling back to snapshot:', error);
      if (!isSnapshotCall) {
        const snapshot = await this.fetchSnapshot();
        if (snapshot) return this.cacheAndReturn(snapshot.data);
      }
      return { topPlayers: [], teamLeaderboard: [], gamesCount: 0, liveGamesCount: 0 };
    }

    const { games } = scoresResult;
    // For normal calls use NHL's own currentDate (Eastern time); for snapshot cron (runs
    // after midnight UTC) use yesterday's UTC date which aligns with the Eastern game day.
    const dateString = isSnapshotCall ? this.getDateString(-1) : scoresResult.currentDate;
    const filteredGames = games.filter((g) => g.gameDate === dateString);
    // Include all active games across all dates — games that started on the previous day
    // but ran past midnight ET must be processed for play-by-play, not dropped.
    const activeGames = games.filter((g) => ACTIVE_GAME_STATES.includes(g.gameState));
    const liveGames = games.filter((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT');

    if (!isSnapshotCall) {
      const snapshot = await this.fetchSnapshot();
      if (snapshot && this.shouldServeSnapshot(snapshot, games, scoresResult.currentDate)) {
        return this.cacheAndReturn(snapshot.data);
      }
    }

    if (activeGames.length === 0) {
      return {
        topPlayers: [],
        teamLeaderboard: [],
        gamesCount: filteredGames.length,
        liveGamesCount: liveGames.length,
      };
    }

    const { playerMap, playedGoalies } = await this.buildPlayerAccumulators(activeGames);
    const { skaters, goalies } = this.splitSkaterAndGoalies(playerMap, playedGoalies);

    const nhlPlayerIds = [
      ...skaters.map((p) => p.nhlPlayerId),
      ...goalies.map((p) => p.nhlPlayerId),
    ];
    const ownershipMap = await this.batchLookupOwnership(nhlPlayerIds);

    const allPlayers = this.buildSortedLivePlayers(skaters, goalies, ownershipMap);

    const topPlayers = allPlayers
      .filter((p) => p.position !== GOALIE_POSITION)
      .slice(0, TOP_PLAYERS_LIMIT);

    // Build team leaderboard from owned players, including teams with 0 points
    const teamLeaderboard = await this.buildTeamLeaderboard(allPlayers, ownershipMap, isSnapshotCall);

    return this.cacheAndReturn({
      topPlayers,
      teamLeaderboard,
      gamesCount: activeGames.length,
      liveGamesCount: liveGames.length,
    });
  }

  /** Returns a UTC date string (YYYY-MM-DD) offset by the given number of days from today. */
  private getDateString(offsetDays = 0): string {
    const d = new Date();
    if (offsetDays !== 0) {
      d.setUTCDate(d.getUTCDate() + offsetDays);
    }
    return d.toISOString().slice(0, 10);
  }

  /**
   * Returns true when the snapshot should be served instead of play-by-play.
   * Conditions (all must hold):
   *  1. Snapshot was written after the most recent cron boundary (03:00 ET / 07:00 UTC).
   *     The nightly cron runs at 03:15 ET (07:15 UTC), so:
   *       - If now >= 03:00 ET today → snapshot must be from today at or after 03:00 ET.
   *       - If now <  03:00 ET today → snapshot must be from yesterday at or after 03:00 ET.
   *  2. No games from the previous game day are active (LIVE, CRIT, FINAL, OFF).
   *  3. No games from the NHL's current date are active (LIVE, CRIT, FINAL, OFF).
   */
  private shouldServeSnapshot(
    snapshot: { data: LivePointsResponse; updatedAt: Date },
    games: GameScore[],
    currentDate: string,
  ): boolean {
    const now = new Date();
    const toEtDateString = (d: Date) =>
      d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
    const toEtMinutes = (d: Date) => {
      const et = new Date(d.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      return et.getHours() * 60 + et.getMinutes();
    };

    const CRON_BOUNDARY_MINUTES = 3 * 60; // 03:00 ET (07:00 UTC)
    const nowMinutes = toEtMinutes(now);
    const snapshotDate = toEtDateString(snapshot.updatedAt);
    const snapshotMinutes = toEtMinutes(snapshot.updatedAt);
    const todayDate = toEtDateString(now);

    // Compute yesterday's ET date string
    const yesterdayMs = now.getTime() - 24 * 60 * 60 * 1000;
    const yesterdayDate = toEtDateString(new Date(yesterdayMs));

    let isSnapshotFresh: boolean;
    if (nowMinutes >= CRON_BOUNDARY_MINUTES) {
      // After 19:00 ET today: snapshot must be from today at or after 19:00
      isSnapshotFresh =
        snapshotDate === todayDate && snapshotMinutes >= CRON_BOUNDARY_MINUTES;
    } else {
      // Before 19:00 ET today: snapshot from yesterday at >= 19:00 OR from today
      isSnapshotFresh =
        (snapshotDate === yesterdayDate && snapshotMinutes >= CRON_BOUNDARY_MINUTES) ||
        snapshotDate === todayDate;
    }

    if (!isSnapshotFresh) return false;

    // The 03:15 ET cron always runs *before* tonight's games (~19:00 ET).
    // Any current-date game that has become active (LIVE, CRIT, FINAL, OFF) therefore
    // postdates the snapshot — serve play-by-play instead.
    const currentDayActive = games
      .filter((g) => g.gameDate === currentDate)
      .some((g) => ACTIVE_GAME_STATES.includes(g.gameState));
    if (currentDayActive) return false;

    // Prev-day games still in progress (overtime past midnight) also block.
    const prevDayInProgress = games
      .filter((g) => g.gameDate !== currentDate)
      .some((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT');
    if (prevDayInProgress) return false;

    // Before 03:00 ET the cron hasn't run yet: the snapshot was written yesterday at 03:15 ET,
    // before last night's games started. Prev-day FINAL/OFF results are not in it yet.
    if (nowMinutes < CRON_BOUNDARY_MINUTES) {
      const prevDayCompleted = games
        .filter((g) => g.gameDate !== currentDate)
        .some((g) => g.gameState === 'FINAL' || g.gameState === 'OFF');
      if (prevDayCompleted) return false;
    }

    return true;
  }

  /** Fetches play-by-play for a single game, returning null on error instead of throwing. */
  private async fetchPlayByPlaySafe(gameId: number): Promise<PlayByPlayResponse | null> {
    try {
      return await this.nhlClient.games.playByPlay(gameId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching play-by-play for game ${gameId}:`, error);
      return null;
    }
  }

  /**
   * Processes all plays from a single game's play-by-play into the shared playerMap.
   * Accumulates goals and assists for skaters, tracks goalie activity, and awards
   * wins/shutouts to the winning goalie once the game reaches FINAL or OFF.
   */
  private processGamePlays(
    pbp: PlayByPlayResponse,
    game: GameScore,
    playerMap: Map<number, PlayerAccumulator>,
    playedGoalies: Set<number>,
  ): void {
    const teams = [game.awayTeam, game.homeTeam];
    const teamIdToAbbrev = new Map(teams.map((t) => [t.id, t.abbrev]));
    const teamLogoMap = new Map(
      teams
        .filter((t) => t.abbrev !== '' && t.logo != null)
        .map((t) => [t.abbrev, t.logo as string]),
    );

    // Build goalie → teamId map from roster
    const goalieTeamMap = new Map<number, number>();

    // Seed all players from the roster so players with 0 points appear
    for (const spot of pbp.rosterSpots ?? []) {
      if (playerMap.has(spot.playerId)) continue;

      const teamAbbrev = spot.teamTriCode
        ?? (spot.teamId != null ? teamIdToAbbrev.get(spot.teamId) : undefined)
        ?? '';

      playerMap.set(spot.playerId, {
        nhlPlayerId: spot.playerId,
        firstName: spot.firstName?.default ?? '',
        lastName: spot.lastName?.default ?? '',
        position: spot.positionCode ?? '',
        nhlTeamAbbrev: teamAbbrev,
        nhlTeamLogo: teamLogoMap.get(teamAbbrev) ?? '',
        headshot: spot.headshot ?? '',
        goals: 0,
        assists: 0,
        wins: 0,
        shutouts: 0,
        goalsAgainst: 0,
      });

      if (spot.positionCode === GOALIE_POSITION && spot.teamId != null) {
        goalieTeamMap.set(spot.playerId, spot.teamId);
      }
    }

    // Track the last goalie seen in net per team and goals against per goalie
    const lastGoalieByTeam = new Map<number, number>();
    const goalsAgainstMap = new Map<number, number>();

    // Accumulate goals/assists and track goalie activity from play-by-play
    for (const play of pbp.plays ?? []) {
      const details = play.details;
      if (!details) continue;

      // Update last-goalie-in-net tracking (any play that includes goalieInNetId)
      if (details.goalieInNetId != null) {
        playedGoalies.add(details.goalieInNetId);
        const goalieTeamId = goalieTeamMap.get(details.goalieInNetId);
        if (goalieTeamId != null) {
          lastGoalieByTeam.set(goalieTeamId, details.goalieInNetId);
        }
      }

      if (play.typeDescKey !== 'goal') continue;

      if (details.scoringPlayerId != null) {
        const p = playerMap.get(details.scoringPlayerId);
        if (p) p.goals++;
      }
      if (details.assist1PlayerId != null) {
        const p = playerMap.get(details.assist1PlayerId);
        if (p) p.assists++;
      }
      if (details.assist2PlayerId != null) {
        const p = playerMap.get(details.assist2PlayerId);
        if (p) p.assists++;
      }

      // Count goals against the goalie who was scored on
      if (details.goalieInNetId != null) {
        goalsAgainstMap.set(
          details.goalieInNetId,
          (goalsAgainstMap.get(details.goalieInNetId) ?? 0) + 1,
        );
      }
    }

    // Fallback: if no goalieInNetId event was seen (game just started, no shots yet),
    // include all goalies from this game's roster so starting goalies aren't filtered out
    const goalieIds = Array.from(goalieTeamMap.keys());
    const gameHadGoalieEvents = goalieIds.some((id) => playedGoalies.has(id));
    if (!gameHadGoalieEvents) {
      for (const goalieId of goalieIds) {
        playedGoalies.add(goalieId);
      }
    }

    // Award wins and shutouts for completed games
    const COMPLETED_STATES = ['FINAL', 'OFF'];
    if (COMPLETED_STATES.includes(game.gameState)) {
      const awayScore = game.awayTeam.score ?? 0;
      const homeScore = game.homeTeam.score ?? 0;

      if (awayScore !== homeScore) {
        const winningTeamId = awayScore > homeScore ? game.awayTeam.id : game.homeTeam.id;
        const winningGoalieId = lastGoalieByTeam.get(winningTeamId);

        if (winningGoalieId != null) {
          const goalie = playerMap.get(winningGoalieId);
          if (goalie) {
            goalie.wins++;
            const goalsAgainst = goalsAgainstMap.get(winningGoalieId) ?? 0;
            if (goalsAgainst === 0) {
              goalie.shutouts++;
            }
          }
        }
      }
    }
  }

  /** Fetches play-by-play for all active games concurrently and builds the player accumulator map. */
  private async buildPlayerAccumulators(
    activeGames: GameScore[],
  ): Promise<{ playerMap: Map<number, PlayerAccumulator>; playedGoalies: Set<number> }> {
    const playByPlayResults = await Promise.all(
      activeGames.map((game) => this.fetchPlayByPlaySafe(game.id)),
    );

    const playerMap = new Map<number, PlayerAccumulator>();
    const playedGoalies = new Set<number>();

    for (let i = 0; i < activeGames.length; i++) {
      const pbp = playByPlayResults[i];
      if (!pbp) continue;
      this.processGamePlays(pbp, activeGames[i], playerMap, playedGoalies);
    }

    return { playerMap, playedGoalies };
  }

  /** Splits the player accumulator map into skaters and goalies who actually played. */
  private splitSkaterAndGoalies(
    playerMap: Map<number, PlayerAccumulator>,
    playedGoalies: Set<number>,
  ): { skaters: PlayerAccumulator[]; goalies: PlayerAccumulator[] } {
    const allPlayers = Array.from(playerMap.values());
    return {
      skaters: allPlayers.filter((p) => p.position !== GOALIE_POSITION),
      goalies: allPlayers.filter(
        (p) => p.position === GOALIE_POSITION && playedGoalies.has(p.nhlPlayerId),
      ),
    };
  }

  /** Maps a single PlayerAccumulator to a LivePlayerPoints object, attaching pool ownership. */
  private buildLivePlayer(
    p: PlayerAccumulator,
    pts: number,
    ownershipMap: Map<number, OwnershipRow>,
  ): LivePlayerPoints {
    const ownership = ownershipMap.get(p.nhlPlayerId);
    return {
      nhlPlayerId: p.nhlPlayerId,
      firstName: p.firstName,
      lastName: p.lastName,
      position: p.position,
      nhlTeamAbbrev: p.nhlTeamAbbrev,
      nhlTeamLogo: p.nhlTeamLogo,
      headshot: p.headshot,
      goals: p.goals,
      assists: p.assists,
      points: pts,
      wins: p.wins,
      shutouts: p.shutouts,
      poolTeam: ownership !== undefined && ownership.equipe_id !== null
        ? { id: ownership.equipe_id, nom: ownership.equipe_nom as string }
        : undefined,
    };
  }

  /** Combines skaters and goalies into a single list sorted by points then goals. */
  private buildSortedLivePlayers(
    skaters: PlayerAccumulator[],
    goalies: PlayerAccumulator[],
    ownershipMap: Map<number, OwnershipRow>,
  ): LivePlayerPoints[] {
    const skaterPlayers = skaters.map((p) =>
      this.buildLivePlayer(p, p.goals + p.assists, ownershipMap),
    );
    const goaliePlayers = goalies.map((p) =>
      this.buildLivePlayer(p, calculateGoaliePoints(p.wins, p.shutouts), ownershipMap),
    );
    return [...skaterPlayers, ...goaliePlayers]
      .sort((a, b) => b.points - a.points || b.goals - a.goals);
  }

  /** Queries pool ownership for a batch of NHL player IDs, returning a map keyed by NHL ID. */
  private async batchLookupOwnership(
    nhlPlayerIds: number[],
  ): Promise<Map<number, OwnershipRow>> {
    const map = new Map<number, OwnershipRow>();
    if (nhlPlayerIds.length === 0) return map;

    try {
      const result = await pool.query(QUERIES.GET_BATCH_OWNERSHIP_BY_NHL_IDS, [nhlPlayerIds]);
      for (const row of result.rows as OwnershipRow[]) {
        map.set(row.nhl_player_id, row);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error batch looking up player ownership:', error);
    }

    return map;
  }

  /** Stores a response in the in-memory cache and returns it. */
  private cacheAndReturn(response: LivePointsResponse): LivePointsResponse {
    this.cachedResponse = response;
    this.cacheExpiry = Date.now() + CACHE_TTL_MS;
    return response;
  }

  /** Reads the latest live_points snapshot from api_store, including its updated_at timestamp. */
  private async fetchSnapshot(): Promise<{ data: LivePointsResponse; updatedAt: Date } | null> {
    try {
      const result = await pool.query(QUERIES.GET_API_STORE, ['live_points']);
      if (result.rows.length === 0) return null;
      return {
        data: result.rows[0].json_response as LivePointsResponse,
        updatedAt: result.rows[0].updated_at as Date,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching live_points snapshot from api_store:', error);
      return null;
    }
  }

  /**
   * Computes each pool team's points earned today by diffing the current equipe_points
   * totals against the classement_prev snapshot. Guards against NHL point retractions.
   */
  private async fetchDailyPointsDiff(): Promise<Map<number, number>> {
    const { getCurrentSeason } = await import('./seasonHelper');
    const season = getCurrentSeason();
    const [prevResult, currResult] = await Promise.all([
      pool.query(QUERIES.GET_API_STORE, ['classement_prev']),
      pool.query(QUERIES.GET_CURRENT_EQUIPE_POINTS_ALL, [season]),
    ]);
    const prevTeams: Record<string, number> = prevResult.rows[0]?.json_response?.teams ?? {};
    return new Map<number, number>(
      (currResult.rows as { equipe_id: number; total_points: number }[]).map((r) => [
        r.equipe_id,
        Math.max(0, r.total_points - (prevTeams[String(r.equipe_id)] ?? 0)),
      ]),
    );
  }

  /**
   * Builds the pool team leaderboard from live player stats.
   * For snapshot calls, total points come from the daily diff to reflect any NHL corrections.
   * All active pool teams are seeded with 0 points so teams without scorers still appear.
   */
  private async buildTeamLeaderboard(
    allPlayers: LivePlayerPoints[],
    ownershipMap: Map<number, OwnershipRow>,
    isSnapshotCall: boolean,
  ): Promise<LiveTeamPoints[]> {
    const teamMap = new Map<number, LiveTeamPoints>();

    // Seed all active teams
    try {
      const result = await pool.query(QUERIES.GET_ACTIVE_TEAMS);
      const teamsRows = result.rows as { id: number; nom: string }[];
      for (const row of teamsRows) {
        teamMap.set(row.id, {
          equipeId: row.id,
          equipeNom: row.nom,
          totalPoints: 0,
          totalPJ: 0,
          totalGoals: 0,
          totalAssists: 0,
          attaquePoints: 0,
          defensePoints: 0,
          gardienPoints: 0,
          players: [],
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching active teams for leaderboard:', error);
    }

    // For snapshot calls, totalPoints is derived from the diff (current equipe_points − yesterday's
    // baseline) so that any NHL point retractions are automatically reflected.
    let diffMap: Map<number, number> | null = null;
    if (isSnapshotCall) {
      try {
        diffMap = await this.fetchDailyPointsDiff();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching daily points diff:', error);
      }
    }

    for (const player of allPlayers) {
      if (!player.poolTeam) continue;

      const team = teamMap.get(player.poolTeam.id);
      if (!team) continue;

      team.totalGoals += player.goals;
      team.totalAssists += player.assists;

      if (!isSnapshotCall) {
        team.totalPJ += 1;
        team.totalPoints += player.points;
      } else if (ownershipMap.get(player.nhlPlayerId)?.compte_points) {
        team.totalPJ += 1;
        team.totalPoints += player.points;
      }

      if (player.position === GOALIE_POSITION) {
        team.gardienPoints += player.points;
      } else if (player.position === DEFENSE_POSITION) {
        team.defensePoints += player.points;
      } else {
        team.attaquePoints += player.points;
      }
      team.players.push(player);
    }

    // Override totals with the authoritative diff when available
    if (diffMap) {
      for (const team of Array.from(teamMap.values())) {
        team.totalPoints = diffMap.get(team.equipeId) ?? 0;
      }
    }

    return Array.from(teamMap.values())
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        const ppmA = a.totalPJ > 0 ? a.totalPoints / a.totalPJ : 0;
        const ppmB = b.totalPJ > 0 ? b.totalPoints / b.totalPJ : 0;
        return ppmB - ppmA;
      });
  }
}

export const livePointsService = new LivePointsService();
