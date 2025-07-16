import React from 'react';
import { useHomeActivity } from '@/hooks/home/useHomeActivity';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/ui/loading';

export const HomeActivityFeed: React.FC = () => {
  const { data, isLoading, error } = useHomeActivity();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500">Erreur lors du chargement de l’activité.</div>;
  if (!data || data.length === 0) return <div>Aucune activité récente.</div>;

  return (
    <div className="space-y-4">
      {data.map((activity) => (
        <Card key={activity.id} className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={activity.type === 'trade' ? 'default' : 'secondary'}>
                    {activity.type === 'trade' ? 'Échange' : activity.type === 'scoring' ? 'Score' : 'Match'}
                  </Badge>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
                <p className="font-medium text-gray-900 mb-1">{activity.description}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 