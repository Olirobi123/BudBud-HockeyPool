// Export centralisé des utilitaires
export * from './response';
export * from './database';

// Utilitaires génériques
export const isValidId = (id: string | number): boolean => {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return !isNaN(numId) && numId > 0;
};

export const sanitizeString = (str: string): string => str.trim().replace(/[<>]/g, '');

export const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
