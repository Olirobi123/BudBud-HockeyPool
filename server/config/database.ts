import { Pool, types } from 'pg';
import dotenv from 'dotenv';

// Return DATE columns as plain strings (e.g. "2026-02-26") instead of
// Date objects, which would be serialised as UTC midnight and cause a
// -1 day shift for browsers in negative-offset timezones.
types.setTypeParser(1082, (val: string) => val);

// Charger les variables d'environnement
dotenv.config();

// Configuration du pool de connexion
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Tester la connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur lors de la connexion à PostgreSQL:', err.stack);
  } else {
    console.log('Connexion à PostgreSQL établie avec succès');
    release();
  }
});

// Gestionnaire d'erreurs du pool
pool.on('error', (err) => {
  console.error('Erreur inattendue du pool PostgreSQL:', err);
});

export default pool;
