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
import livePointsRoutes from './routes/livePoints';
import snapshotRoutes from './routes/snapshot';
import misAuBallotageRoutes from './routes/misAuBallotage';
import injuriesRoutes from './routes/injuries';
import etatRoutes from './routes/etat';
import seriesRoutes from './routes/series';

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

  // Routes pour les points en direct
  app.use('/api/live-points', livePointsRoutes);

  // Routes pour les snapshots nocturnes (cron)
  app.use('/api/snapshot', snapshotRoutes);

  // Routes pour les mises au ballotage
  app.use('/api/mis-au-ballotage', misAuBallotageRoutes);

  // Routes pour les blessures
  app.use('/api/injuries', injuriesRoutes);

  // Routes pour l'état des joueurs (hot/cold/normal)
  app.use('/api/etat', etatRoutes);

  // Routes pour les séries éliminatoires
  app.use('/api/series', seriesRoutes);

  const httpServer = createServer(app);

  return httpServer;
}
