import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error: Error | unknown;
  onRetry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ErrorDisplay({ 
  error, 
  onRetry, 
  className = '', 
  size = 'md' 
}: ErrorDisplayProps) {
  const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
  
  const sizeClasses = {
    sm: 'text-sm p-2',
    md: 'text-base p-4',
    lg: 'text-lg p-6'
  };

  return (
    <Alert variant="destructive" className={`${sizeClasses[size]} ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{errorMessage}</span>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="ml-4"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Composant pour erreurs inline simples
export function InlineError({ 
  message, 
  className = '' 
}: { 
  message: string; 
  className?: string; 
}) {
  return (
    <div className={`text-red-500 text-sm flex items-center ${className}`}>
      <AlertCircle className="h-3 w-3 mr-1" />
      {message}
    </div>
  );
} 