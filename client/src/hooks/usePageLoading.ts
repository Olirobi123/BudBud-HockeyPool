import { useEffect, useRef } from 'react';
import { useLoading } from '@/lib/loading-context';

interface UsePageLoadingOptions {
  dependencies?: boolean[];
  delay?: number;
}

export function usePageLoading(options: UsePageLoadingOptions = {}) {
  const { dependencies = [], delay = 0 } = options;
  const { setPageLoading } = useLoading();
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Si toutes les dépendances sont false (pas de loading)
    const isLoading = dependencies.some((dep) => dep === true);

    if (!isLoading && !hasLoaded.current) {
      if (delay > 0) {
        const timer = setTimeout(() => {
          hasLoaded.current = true;
          setPageLoading(false);
        }, delay);

        return () => clearTimeout(timer);
      } else {
        hasLoaded.current = true;
        setPageLoading(false);
      }
    }
  }, [dependencies, delay, setPageLoading]);

  // Reset hasLoaded when dependencies change to loading state
  useEffect(() => {
    const isLoading = dependencies.some((dep) => dep === true);
    if (isLoading && hasLoaded.current) {
      hasLoaded.current = false;
    }
  }, [dependencies]);

  return {
    isPageLoaded: hasLoaded.current,
    setPageLoaded: (loaded: boolean) => {
      hasLoaded.current = loaded;
      setPageLoading(!loaded);
    },
  };
}
