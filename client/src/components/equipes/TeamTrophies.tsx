import { Trophy } from 'lucide-react';
import { useTeamTrophies } from '@/hooks/useTrophees';
import { TropheesList } from '@/components/trophees/TropheesList';

interface TeamTrophiesProps {
  teamId: number;
}

export function TeamTrophies({ teamId }: TeamTrophiesProps) {
  const { data: trophees, isLoading } = useTeamTrophies(teamId);

  const count = trophees?.length || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Trophées
        {count > 0 && (
          <span className="text-sm font-normal text-muted-foreground">
            (
            {count}
            )
          </span>
        )}
      </h3>
      <TropheesList trophees={trophees || []} isLoading={isLoading} />
    </div>
  );
}
