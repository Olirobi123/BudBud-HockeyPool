import type { Express } from 'express';
import { createServer, type Server } from 'http';
import teamsRoutes from './routes/teams';
import echangesRoutes from './routes/echanges';
import playersRoutes from './routes/players';
import repechageRoutes from './routes/repechage';
import scoresRoutes from './routes/scores';
import healthRoutes from './routes/health';
import tropheesRoutes from './routes/trophees';
import pointsRoutes from './routes/points';

export async function registerRoutes(app: Express): Promise<Server> {
  // Routes pour les équipes
  app.use('/api/teams', teamsRoutes);

  // Routes pour le repêchage
  app.use('/api/repechage', repechageRoutes);

  // Routes pour les échanges
  app.use('/api/echanges', echangesRoutes);

  // Routes pour les joueurs
  app.use('/api/players', playersRoutes);

  // Routes pour les scores NHL
  app.use('/api/scores', scoresRoutes);

  // Routes pour le health check
  app.use('/api/health', healthRoutes);

  // Routes pour les trophées
  app.use('/api/trophees', tropheesRoutes);

  // Routes pour les points / classement
  app.use('/api/points', pointsRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
