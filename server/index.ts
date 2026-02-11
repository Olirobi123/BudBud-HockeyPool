import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import pool from './config/database';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { log } from './utils/logger';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());

// CORS — origines autorisées via variable d'environnement (séparées par des virgules)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false,
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes. Réessayez plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Logging middleware pour les routes API
app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson as Record<string, unknown>;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith('/api')) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = `${logLine.slice(0, 79)}…`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    await pool.query('SELECT 1');
    log('Connexion à la base de données établie', 'postgres');

    const server = await registerRoutes(app);

    app.use(errorHandler);

    const port = Number(process.env.PORT) || 5000;
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    log(`Erreur lors du démarrage du serveur: ${error}`, 'error');
    process.exit(1);
  }
})();
