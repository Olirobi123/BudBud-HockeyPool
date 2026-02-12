import React from 'react';
import { ArrowLeftRight, Target, Swords } from 'lucide-react';
import { useHomeActivity } from '@/hooks/home/useHomeActivity';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/ui/loading';
import { InlineError } from '@/components/ui/error-display';
import type { HomeActivity } from '@/types/IHome';

const activityConfig: Record<HomeActivity['type'], {
  icon: React.ComponentType<{ className?: string }>;
  dotColor: string;
  badgeClass: string;
}> = {
  Échange: {
    icon: ArrowLeftRight,
    dotColor: 'bg-cyan-400',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 hover:bg-cyan-500/20',
  },
  scoring: {
    icon: Target,
    dotColor: 'bg-amber-400',
    badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20',
  },
  match: {
    icon: Swords,
    dotColor: 'bg-blue-400',
    badgeClass: 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20',
  },
};

export const HomeActivityFeed: React.FC = () => {
  const { data, isLoading, error } = useHomeActivity();

  if (isLoading) return <Loading />;
  if (error) return <InlineError message="Erreur lors du chargement de l'activité." />;
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Aucune activité récente.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-border via-border to-transparent" />

      <div className="space-y-3">
        {data.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div
              key={activity.id ?? index}
              className="relative pl-10 animate-fade-in"
              style={{ animationDelay: `${index * 0.06}s`, animationFillMode: 'both' }}
            >
              {/* Timeline dot */}
              <div className={`absolute left-[11px] top-5 w-[9px] h-[9px] rounded-full ${config.dotColor} ring-[3px] ring-card`} />

              <Card className="border-border/60 hover:border-border hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0 ${config.badgeClass}`}
                          >
                            {activity.type}
                          </Badge>
                          <span className="text-sm font-medium text-foreground truncate">
                            {activity.description}
                          </span>
                        </div>
                        {activity.details !== undefined && activity.details !== '' && (
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap flex-shrink-0 mt-0.5">
                      {activity.time}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
