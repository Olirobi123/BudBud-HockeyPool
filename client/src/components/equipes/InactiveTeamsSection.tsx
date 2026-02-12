import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type Equipe from '@/types/IEquipes';

interface InactiveTeamsSectionProps {
  teams: Equipe[];
  isLoading: boolean;
}

export function InactiveTeamsSection({ teams, isLoading }: InactiveTeamsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return null;
  if (!teams || teams.length === 0) return null;

  return (
    <Card className="border-muted">
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="flex items-center justify-between text-muted-foreground">
          <span>Équipes Inactives</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{teams.length}</Badge>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </CardTitle>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => navigate(`/equipes/${team.id}`)}
                className="text-sm text-muted-foreground p-3 rounded-md bg-muted/30 text-center hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
              >
                {team.nom}
              </button>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
