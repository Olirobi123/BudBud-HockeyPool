import React from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { EchangeStatusBadge } from './EchangeStatusBadge';
import { formatDate } from '@/lib/utils';
import Echange from '@/types/IEchange';

interface EchangeCardProps {
  echange: Echange;
  compact?: boolean;
}

export const EchangeCard: React.FC<EchangeCardProps> = ({ echange, compact = false }) => (
  <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-border">
    <CardHeader className="pb-4 bg-muted/50 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{formatDate(echange.date)}</span>
        </div>
        <EchangeStatusBadge statut_confirmer={echange.statut_confirmer} />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className={`grid gap-6 items-center ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{echange.equipe_source_nom}</h3>
        </div>
        <div className="text-center flex justify-center">
          <div className="bg-muted p-2 rounded-full">
            <ArrowLeftRight className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">{echange.equipe_destination_nom}</h3>
        </div>
      </div>

      <div className="mt-6 pt-0">
        <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          <div className="space-y-2">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl shadow-sm h-full">
              <div className="text-sm font-semibold text-primary space-y-2">
                {echange.details.split('|')[0]?.trim().split(',').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap flex items-start">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0 mt-1.5" />
                    {item.replace(/^.*?reçoit:?\s*/i, '').trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
          {!compact && (
            <div className="hidden md:flex items-center justify-center">
              {/* Spacer for desktop layout alignment */}
            </div>
          )}
          <div className="space-y-2">
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl shadow-sm h-full">
              <div className="text-sm font-semibold text-accent space-y-2">
                {echange.details.split('|')[1]?.trim().split(',').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap flex items-start">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2 flex-shrink-0 mt-1.5" />
                    {item.replace(/^.*?reçoit:?\s*/i, '').trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
