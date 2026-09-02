import pool from '../config/database';

/**
 * Exécuter une requête SQL avec gestion d'erreurs
 */
export const executeQuery = async (query: string, params: unknown[] = []) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête:', error);
    console.error('Requête:', query);
    console.error('Paramètres:', params);
    throw error;
  }
};


/**
 * Fermer la connexion à la base de données
 */
export const closeDatabaseConnection = async (): Promise<void> => {
  try {
    await pool.end();
  } catch (error) {
    console.error('Erreur lors de la fermeture de la connexion:', error);
  }
};
