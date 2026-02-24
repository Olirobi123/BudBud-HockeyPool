import { NHLClient, PlayByPlayResponse, GameScore } from '@olirobi/nhl_api_client';
import pool from '../config/database';
import { QUERIES } from '../models';
import { LivePlayerPoints, LiveTeamPoints, LivePointsResponse } from '../types';
import { scoresService } from './scoresService';

const ACTIVE_GAME_STATES = ['LIVE', 'CRIT', 'FINAL', 'OFF'];
const GOALIE_POSITION = 'G';
const DEFENSE_POSITION = 'D';
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
}

interface OwnershipRow {
  nhl_player_id: number;
  nom: string;
  prenom: string;
  position: string;
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

    let games: Awaited<ReturnType<typeof scoresService.getCurrentScores>>;
    try {
      games = await scoresService.getCurrentScores();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('NHL scores API unavailable, falling back to snapshot:', error);
      if (!isSnapshotCall) {
        const snapshot = await this.fetchSnapshot();
        if (snapshot) return this.cacheAndReturn(snapshot);
      }
      return { topPlayers: [], teamLeaderboard: [], gamesCount: 0, liveGamesCount: 0 };
    }

    const dateString = this.getDateString(isSnapshotCall ? -1 : 0);
    const filteredGames = games.filter((g) => g.gameDate === dateString);
    const activeGames = filteredGames.filter((g) => ACTIVE_GAME_STATES.includes(g.gameState));
    const liveGames = filteredGames.filter((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT');

    if (activeGames.length === 0) {
      if (!isSnapshotCall) {
        const snapshot = await this.fetchSnapshot();
        if (snapshot) return this.cacheAndReturn(snapshot);
      }
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

    for (let i = 0; i < activeGames.length; i++) {
      const pbp = playByPlayResults[i];
      if (!pbp) continue;

      const game = activeGames[i];
      this.processGamePlays(pbp, game, playerMap);
    }

    // Filter out goalies
    const skaters = Array.from(playerMap.values()).filter(
      (p) => p.position !== GOALIE_POSITION,
    );

    // Batch lookup pool ownership
    const nhlPlayerIds = skaters.map((p) => p.nhlPlayerId);
    const ownershipMap = await this.batchLookupOwnership(nhlPlayerIds);

    // Build full player list with ownership
    const allPlayers: LivePlayerPoints[] = skaters
      .map((p) => {
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
          points: p.goals + p.assists,
          poolTeam: ownership !== undefined && ownership.equipe_id !== null
            ? { id: ownership.equipe_id, nom: ownership.equipe_nom as string }
            : undefined,
        };
      })
      .sort((a, b) => b.points - a.points || b.goals - a.goals);

    // Top 10 for the feed
    const topPlayers = allPlayers.slice(0, TOP_PLAYERS_LIMIT);

    // Build team leaderboard from owned players, including teams with 0 points
    const teamLeaderboard = await this.buildTeamLeaderboard(allPlayers);

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
  ): void {
    const teams = [game.awayTeam, game.homeTeam];
    const teamIdToAbbrev = new Map(teams.map((t) => [t.id, t.abbrev]));
    const teamLogoMap = new Map(
      teams
        .filter((t) => t.abbrev !== '' && t.logo != null)
        .map((t) => [t.abbrev, t.logo as string]),
    );

    // Seed all skaters from the roster so players with 0 points appear
    for (const spot of pbp.rosterSpots ?? []) {
      if (spot.positionCode === GOALIE_POSITION || playerMap.has(spot.playerId)) continue;

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
      });
    }

    // Accumulate goals and assists from play-by-play
    for (const play of pbp.plays ?? []) {
      if (play.typeDescKey !== 'goal') continue;
      const details = play.details;
      if (!details) continue;

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

  private async fetchSnapshot(): Promise<LivePointsResponse | null> {
    try {
      const result = await pool.query(QUERIES.GET_API_STORE, ['live_points']);
      if (result.rows.length === 0) return null;
      return result.rows[0].json_response as LivePointsResponse;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching live_points snapshot from api_store:', error);
      return null;
    }
  }

  private async buildTeamLeaderboard(allPlayers: LivePlayerPoints[]): Promise<LiveTeamPoints[]> {
    const teamMap = new Map<number, LiveTeamPoints>();

    // Seed all active pool teams so teams with 0 points still appear
    try {
      const result = await pool.query(QUERIES.GET_ACTIVE_TEAMS);
      for (const row of result.rows as { id: number; nom: string }[]) {
        teamMap.set(row.id, {
          equipeId: row.id,
          equipeNom: row.nom,
          totalPoints: 0,
          totalGoals: 0,
          totalAssists: 0,
          attaquePoints: 0,
          defensePoints: 0,
          players: [],
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching active teams for leaderboard:', error);
    }

    for (const player of allPlayers) {
      if (!player.poolTeam) continue;

      const team = teamMap.get(player.poolTeam.id);
      if (!team) continue;

      team.totalPoints += player.points;
      team.totalGoals += player.goals;
      team.totalAssists += player.assists;
      if (player.position === DEFENSE_POSITION) {
        team.defensePoints += player.points;
      } else {
        team.attaquePoints += player.points;
      }
      team.players.push(player);
    }

    return Array.from(teamMap.values())
      .sort((a, b) => b.totalPoints - a.totalPoints || b.totalGoals - a.totalGoals);
  }
}

export const livePointsService = new LivePointsService();
