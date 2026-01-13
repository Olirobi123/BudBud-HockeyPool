import type { Express } from 'express';
import { createServer, type Server } from 'http';
import { NHLClient } from '@olirobi/nhl_api_client';
import teamsRoutes from './routes/teams';
import echangesRoutes from './routes/echanges';
import playersRoutes from './routes/players';
import repechageRoutes from './routes/repechage';

export async function registerRoutes(app: Express): Promise<Server> {
  // Routes pour les équipes
  app.use('/api/teams', teamsRoutes);

  // Routes pour le repêchage
  app.use('/api/repechage', repechageRoutes);

  // Routes pour les échanges
  app.use('/api/echanges', echangesRoutes);
  // Routes pour les joueurs
  app.use('/api/players', playersRoutes);
  // NHL Player Search API Proxy
  app.get('/api/search/players', async (req, res) => {
    try {
      const query = req.query.q as string;

      if (!query || query.length < 2) {
        return res.json([]);
      }

      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 5000); // Timeout after 5 seconds

      const playerName = query.trim();
      const nhlClient = new NHLClient();
      const response = await nhlClient.players.search(playerName);

      if (!response) {
        return res.status(500).json({ error: 'Unexpected error. Failed to fetch player data' });
      }

      res.json(response);
    } catch (error) {
      console.error('Player search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
