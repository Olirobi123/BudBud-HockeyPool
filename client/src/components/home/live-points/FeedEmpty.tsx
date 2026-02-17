import { Target } from 'lucide-react';

export function FeedEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Target className="w-10 h-10 text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground">
        Aucun point marqué ce soir
      </p>
    </div>
  );
}
