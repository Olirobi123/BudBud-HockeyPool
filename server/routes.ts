import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import teamsRoutes from "./routes/teams";
import echangesRoutes from "./routes/echanges";

export async function registerRoutes(app: Express): Promise<Server> {
  // Routes pour les équipes
  app.use('/api/teams', teamsRoutes);
  // Routes pour les échanges
  app.use('/api/echanges', echangesRoutes);
  // NHL Player Search API Proxy
  app.get("/api/search/players", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.json([]);
      }

      const encodedQuery = encodeURIComponent(query.trim() + " *");
      const nhlApiUrl = `https://search.d3.nhle.com/api/v1/search/player?culture=en-us&limit=10&q=${encodedQuery}&active=true`;
      
      const response = await fetch(nhlApiUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; 38BudBud/1.0)',
        },
      });

      if (!response.ok) {
        console.error(`NHL API error: ${response.status}`);
        return res.status(response.status).json({ error: 'Failed to fetch player data' });
      }

      const data = await response.json();
      res.json(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Player search error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
