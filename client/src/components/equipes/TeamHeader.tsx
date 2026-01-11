import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Users, User } from 'lucide-react';
import Equipe from '@/types/IEquipes';

interface TeamHeaderProps {
  team: Equipe;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-blue-600 to-cyan-500" />
      <CardContent className="relative pt-0 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 px-2 gap-4">
          <div className="rounded-full p-2 bg-white shadow-lg">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white">
              <Users className="w-12 h-12 text-slate-400" />
            </div>
          </div>
          
          <div className="flex-1 mt-4 md:mt-0 md:mb-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">{team.nom}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm text-gray-600">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                DG: Olivier (Placeholder)
              </span>
              <Badge variant={team.active ? "default" : "secondary"}>
                {team.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
