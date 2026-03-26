// Re-export types from NHL API client for consistency
import type { PlayerStatsResponse, PlayerSearchResult } from '@olirobi/nhl_api_client';
import type Equipe from '@/types/IEquipes';

// Export search result as NHLPlayer for player search
export type NHLPlayer = PlayerSearchResult;

// PlayerDetails extends the NHL API response with pool-specific data
type PlayerDetails = PlayerStatsResponse & {
  ownership: Equipe | null;
};
export default PlayerDetails;
