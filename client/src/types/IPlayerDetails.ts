// Re-export types from NHL API client for consistency
import type { PlayerStatsResponse, PlayerSearchResult } from '@olirobi/nhl_api_client';

// Export search result as NHLPlayer for player search
export type NHLPlayer = PlayerSearchResult;

// Export PlayerStatsResponse as PlayerDetails for player detail pages
type PlayerDetails = PlayerStatsResponse;
export default PlayerDetails;
