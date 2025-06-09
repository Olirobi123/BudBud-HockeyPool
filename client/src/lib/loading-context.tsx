import { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  setPageLoading: (loading: boolean) => void;
  isPageLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  const setPageLoading = useCallback((loading: boolean) => {
    if (!loading) {
    
        setIsPageLoading(false);
    } else {
      setIsPageLoading(true);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ setPageLoading, isPageLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
