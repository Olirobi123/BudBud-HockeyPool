import React from 'react';
import { useHomeActivity } from '@/hooks/home/useHomeActivity';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import { InlineError } from '@/components/ui/error-display';

export const HomeActivityFeed: React.FC = () => {
  const { data, isLoading, error } = useHomeActivity();

  if (isLoading) return <Loading />;
  if (error) return <InlineError message="Erreur lors du chargement de l'activité." />;
  if (!data || data.length === 0) return <div>Aucune activité récente.</div>;

  return (
    <div className="space-y-4">
      {data.map((activity, index) => (
        <Card key={index} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                  {activity.type}
                </Badge>
                                 <span className="text-sm font-medium">{activity.description}</span>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
                         {activity.details && <p className="text-sm text-gray-600 mt-2">{activity.details}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 