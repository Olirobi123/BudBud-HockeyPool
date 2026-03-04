import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Equipe from '@/types/IEquipes';
import { TeamAvatar } from './TeamAvatar';

interface TeamHeaderProps {
  team: Equipe;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500" />
      <CardContent className="relative pt-0 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 px-2 gap-4">
          <div className="rounded-full p-1 bg-white shadow-lg">
            <TeamAvatar teamId={team.id} teamName={team.nom} size="xl" bordered={false} />
          </div>

          <div className="flex-1 mt-4 md:mt-0 md:mb-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{team.nom}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm text-gray-600">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                DG: {team.dg_name ?? 'Non disponible'}
              </span>
              <Badge variant={team.active ? 'default' : 'secondary'}>
                {team.active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
