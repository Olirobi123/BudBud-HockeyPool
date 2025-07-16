export class PlayersService {
  private readonly NHL_API_BASE = 'https://api-web.nhle.com/v1';
  private readonly REQUEST_TIMEOUT = 5000;

  /**
   * Récupérer les détails d'un joueur depuis l'API NHL
   */
  async getPlayerById(id: string): Promise<any> {
    // Validation de l'ID
    if (!/^\d+$/.test(id)) {
      throw new Error('ID de joueur invalide');
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, this.REQUEST_TIMEOUT);

    try {
      const response = await fetch(`${this.NHL_API_BASE}/player/${id}/landing`, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; 38BudBud/1.0)',
        },
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`NHL API error: ${response.status}`);
        throw new Error('Erreur lors de la récupération des données du joueur');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout lors de la récupération des données du joueur');
        }
        throw error;
      }
      
      throw new Error('Erreur lors de la récupération des données du joueur');
    }
  }

  /**
   * Rechercher des joueurs (peut être étendu pour d'autres sources)
   */
  async searchPlayers(query: string): Promise<any[]> {
    // Pour l'instant, cette méthode peut être utilisée pour des recherches futures
    // ou pour interfacer avec une base de données locale de joueurs
    throw new Error('Méthode de recherche non implémentée');
  }
}

export const playersService = new PlayersService(); 