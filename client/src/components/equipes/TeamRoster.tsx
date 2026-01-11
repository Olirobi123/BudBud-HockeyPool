import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TeamRosterProps {
  roster: any[]; // To be typed properly when roster implemented
  isLoading: boolean;
}

export function TeamRoster({ roster, isLoading }: TeamRosterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Effectif Actuel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {roster.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Effectif à venir</h3>
            <p className="max-w-sm mt-1">
              L'effectif de cette équipe n'est pas encore disponible. Il sera affiché ici dès que les données seront importées.
            </p>
          </div>
        ) : (
          <div>
            {/* Table placeholder for future implementation */}
            <p>Liste des joueurs...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
