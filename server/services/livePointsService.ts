import { NHLClient, PlayByPlayResponse, GameScore, RosterSpot } from '@olirobi/nhl_api_client';
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

  async getLivePoints(): Promise<LivePointsResponse> {
    if (this.cachedResponse && Date.now() < this.cacheExpiry) {
      return this.cachedResponse;
    }

    const games = await scoresService.getCurrentScores();

    const activeGames = games.filter((g) => ACTIVE_GAME_STATES.includes(g.gameState));
    const liveGames = games.filter((g) => g.gameState === 'LIVE' || g.gameState === 'CRIT');

    if (activeGames.length === 0) {
      return {
        topPlayers: [],
        teamLeaderboard: await this.buildTeamLeaderboard([]),
        gamesCount: games.length,
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

    const response: LivePointsResponse = {
      topPlayers,
      teamLeaderboard,
      gamesCount: activeGames.length,
      liveGamesCount: liveGames.length,
    };

    this.cachedResponse = response;
    this.cacheExpiry = Date.now() + CACHE_TTL_MS;

    return response;
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
    const rosterMap = new Map<number, RosterSpot>();
    for (const spot of pbp.rosterSpots ?? []) {
      rosterMap.set(spot.playerId, spot);
    }

    // Build team ID → abbrev map (fallback when rosterSpot.teamTriCode is missing)
    const teamIdToAbbrev = new Map<number, string>();
    teamIdToAbbrev.set(game.awayTeam.id, game.awayTeam.abbrev);
    teamIdToAbbrev.set(game.homeTeam.id, game.homeTeam.abbrev);

    // Build team logo map from game data
    const teamLogoMap = new Map<string, string>();
    if (game.awayTeam.abbrev !== '' && game.awayTeam.logo != null) {
      teamLogoMap.set(game.awayTeam.abbrev, game.awayTeam.logo);
    }
    if (game.homeTeam.abbrev !== '' && game.homeTeam.logo != null) {
      teamLogoMap.set(game.homeTeam.abbrev, game.homeTeam.logo);
    }

    const goalPlays = (pbp.plays ?? []).filter(
      (play) => play.typeDescKey === 'goal',
    );

    for (const play of goalPlays) {
      const details = play.details;
      if (!details) continue;

      // Process scorer
      if (details.scoringPlayerId != null) {
        this.addPlayerPoints(details.scoringPlayerId, 'goal', rosterMap, teamLogoMap, teamIdToAbbrev, playerMap);
      }

      // Process assist 1
      if (details.assist1PlayerId != null) {
        this.addPlayerPoints(details.assist1PlayerId, 'assist', rosterMap, teamLogoMap, teamIdToAbbrev, playerMap);
      }

      // Process assist 2
      if (details.assist2PlayerId != null) {
        this.addPlayerPoints(details.assist2PlayerId, 'assist', rosterMap, teamLogoMap, teamIdToAbbrev, playerMap);
      }
    }
  }

  private addPlayerPoints(
    playerId: number,
    type: 'goal' | 'assist',
    rosterMap: Map<number, RosterSpot>,
    teamLogoMap: Map<string, string>,
    teamIdToAbbrev: Map<number, string>,
    playerMap: Map<number, PlayerAccumulator>,
  ): void {
    const existing = playerMap.get(playerId);

    if (existing) {
      if (type === 'goal') existing.goals++;
      else existing.assists++;
      return;
    }

    const rosterSpot = rosterMap.get(playerId);
    // teamTriCode may be absent (e.g. international games); fall back to teamId lookup
    const teamAbbrev = rosterSpot?.teamTriCode
      ?? (rosterSpot?.teamId != null ? teamIdToAbbrev.get(rosterSpot.teamId) : undefined)
      ?? '';

    playerMap.set(playerId, {
      nhlPlayerId: playerId,
      firstName: rosterSpot?.firstName?.default ?? '',
      lastName: rosterSpot?.lastName?.default ?? '',
      position: rosterSpot?.positionCode ?? '',
      nhlTeamAbbrev: teamAbbrev,
      nhlTeamLogo: teamLogoMap.get(teamAbbrev) ?? '',
      headshot: rosterSpot?.headshot ?? '',
      goals: type === 'goal' ? 1 : 0,
      assists: type === 'assist' ? 1 : 0,
    });
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

      const isDefense = player.position === DEFENSE_POSITION;
      const existing = teamMap.get(player.poolTeam.id);
      if (existing) {
        existing.totalPoints += player.points;
        existing.totalGoals += player.goals;
        existing.totalAssists += player.assists;
        if (isDefense) {
          existing.defensePoints += player.points;
        } else {
          existing.attaquePoints += player.points;
        }
        existing.players.push(player);
      } else {
        teamMap.set(player.poolTeam.id, {
          equipeId: player.poolTeam.id,
          equipeNom: player.poolTeam.nom,
          totalPoints: player.points,
          totalGoals: player.goals,
          totalAssists: player.assists,
          attaquePoints: isDefense ? 0 : player.points,
          defensePoints: isDefense ? player.points : 0,
          players: [player],
        });
      }
    }

    return Array.from(teamMap.values())
      .sort((a, b) => b.totalPoints - a.totalPoints || b.totalGoals - a.totalGoals);
  }
}

export const livePointsService = new LivePointsService();
