import { BACKEND_URL } from '@/lib/apiConfig';

// Toutes les routes /api/draft-day renvoient { success, data }.
// eslint-disable-next-line import/prefer-default-export
export async function fetchDraftDay<T>(path: string, errorMessage: string): Promise<T> {
  const response = await fetch(`${BACKEND_URL}/api/draft-day${path}`);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  const result = await response.json();
  return result.data as T;
}
