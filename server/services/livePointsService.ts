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
    let activeGames = filteredGames.filter((g) => ACTIVE_GAME_STATES.includes(g.gameState));
    let liveGames = filteredGames.filter((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT');
    // Check across ALL dates — a late game from yesterday may still be live after midnight Eastern
    const anyGameLive = games.some((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT');

    // Past-midnight fallback: if currentDate rolled to the next day but yesterday's games are
    // FINAL/OFF (snapshot not yet saved), fall back to yesterday's games for computation.
    if (!isSnapshotCall && activeGames.length === 0 && !anyGameLive) {
      const prevDate = this.getPrevDate(dateString);
      const prevActiveGames = games.filter(
        (g) => g.gameDate === prevDate && ACTIVE_GAME_STATES.includes(g.gameState),
      );
      if (prevActiveGames.length > 0) {
        activeGames = prevActiveGames;
        liveGames = [];
      }
    }

    // No active games (FUT or game-free day) and no live game anywhere — serve snapshot
    // (previous day's results) until the next games become active.
    // Falls through to play-by-play when games are FINAL/OFF.
    if (!isSnapshotCall && activeGames.length === 0 && !anyGameLive) {
      const snapshot = await this.fetchSnapshot();
      if (snapshot) return this.cacheAndReturn(snapshot.data);
    }

    if (activeGames.length === 0) {
      return {
        topPlayers: [],
        teamLeaderboard: [],
        gamesCount: filteredGames.length,
        liveGamesCount: liveGames.length,
      };
    }

    // Fetch play-by-play for all active games concurrently
    const playByPlayResults = await Promise.all(
      activeGames.map((game) => this.fetchPlayByPlaySafe(game.id)),
    );

    // Build player accumulator from all games
    const playerMap = new Map<number, PlayerAccumulator>();
    const playedGoalies = new Set<number>();

    for (let i = 0; i < activeGames.length; i++) {
      const pbp = playByPlayResults[i];
      if (!pbp) continue;

      const game = activeGames[i];
      this.processGamePlays(pbp, game, playerMap, playedGoalies);
    }

    // Separate skaters and goalies (only goalies with at least 1 second of TOI)
    const skaters = Array.from(playerMap.values()).filter(
      (p) => p.position !== GOALIE_POSITION,
    );
    const goalies = Array.from(playerMap.values()).filter(
      (p) => p.position === GOALIE_POSITION && playedGoalies.has(p.nhlPlayerId),
    );

    // Batch lookup pool ownership for all players
    const nhlPlayerIds = [
      ...skaters.map((p) => p.nhlPlayerId),
      ...goalies.map((p) => p.nhlPlayerId),
    ];
    const ownershipMap = await this.batchLookupOwnership(nhlPlayerIds);

    const buildLivePlayer = (
      p: PlayerAccumulator,
      pts: number,
    ): LivePlayerPoints => {
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
    };

    const skaterPlayers: LivePlayerPoints[] = skaters
      .map((p) => buildLivePlayer(p, p.goals + p.assists));

    const goaliePlayers: LivePlayerPoints[] = goalies
      .map((p) => buildLivePlayer(p, calculateGoaliePoints(p.wins, p.shutouts)));

    // Combine and sort by points descending
    const allPlayers: LivePlayerPoints[] = [
      ...skaterPlayers,
      ...goaliePlayers,
    ].sort((a, b) => b.points - a.points || b.goals - a.goals);

    // Top 10 for the feed — exclude goalies
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

  private getDateString(offsetDays = 0): string {
    const d = new Date();
    if (offsetDays !== 0) {
      d.setUTCDate(d.getUTCDate() + offsetDays);
    }
    return d.toISOString().slice(0, 10);
  }

  private getPrevDate(dateString: string): string {
    const d = new Date(`${dateString}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  private async fetchPlayByPlaySafe(gameId: number): Promise<PlayByPlayResponse | null> {
    try {
      return await this.nhlClient.games.playByPlay(gameId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching play-by-play for game ${gameId}:`, error);
      return null;
    }
  }

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

  private cacheAndReturn(response: LivePointsResponse): LivePointsResponse {
    this.cachedResponse = response;
    this.cacheExpiry = Date.now() + CACHE_TTL_MS;
    return response;
  }

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

  private async buildTeamLeaderboard(allPlayers: LivePlayerPoints[], ownershipMap: Map<number, OwnershipRow>, isSnapshotCall: boolean): Promise<LiveTeamPoints[]> {
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

    //Set diff pts
    if (diffMap) {
      Array.from(teamMap.values()).forEach((team) => {
        team.totalPoints = diffMap!.get(team.equipeId) ?? 0;
      });
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
