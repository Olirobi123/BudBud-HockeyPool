import { useEffect, useState } from 'react';

/** Délai sans frappe avant qu'une recherche parte vers l'API. */
export const SEARCH_DEBOUNCE_MS = 750;

/** Renvoie `value` une fois qu'elle n'a pas changé pendant `delayMs`. */
export function useDebouncedValue<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
