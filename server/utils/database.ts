import pool from '../config/database';

/**
 * Exécuter une requête SQL avec gestion d'erreurs
 */
export const executeQuery = async (query: string, params: any[] = []) => {
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
 * Vérifier la connexion à la base de données
 */
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return false;
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