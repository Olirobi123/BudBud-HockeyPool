import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: Error) => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, logError = true, onError } = options;
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((error: Error | unknown) => {
    const errorObj = error instanceof Error ? error : new Error('Une erreur inconnue est survenue');

    // Log l'erreur
    if (logError) {
      console.error('Error handled:', errorObj);
    }

    // Mettre à jour l'état
    setError(errorObj);

    // Afficher un toast
    if (showToast) {
      toast({
        title: 'Erreur',
        description: errorObj.message,
        variant: 'destructive',
      });
    }

    // Callback personnalisé
    if (onError) {
      onError(errorObj);
    }
  }, [showToast, logError, onError, toast]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback((fn: () => void | Promise<void>) => {
    clearError();
    try {
      const result = fn();
      if (result instanceof Promise) {
        result.catch(handleError);
      }
    } catch (error) {
      handleError(error);
    }
  }, [clearError, handleError]);

  return {
    error,
    handleError,
    clearError,
    retry,
    hasError: error !== null,
  };
}
