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
  <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-slate-200">
    <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-600">{formatDate(echange.date)}</span>
        </div>
        <EchangeStatusBadge statut_confirmer={echange.statut_confirmer} />
      </div>
    </CardHeader>
    <CardContent className="pt-6">
      <div className={`grid gap-6 items-center ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{echange.equipe_source_nom}</h3>
        </div>
        <div className="text-center flex justify-center">
          <div className="bg-slate-100 p-2 rounded-full">
            <ArrowLeftRight className="w-6 h-6 text-slate-400" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{echange.equipe_destination_nom}</h3>
        </div>
      </div>
      
      <div className="mt-6 pt-0">
        <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          <div className="space-y-2">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm h-full">
              <div className="text-sm font-semibold text-blue-700 space-y-2">
                {echange.details.split('|')[0]?.trim().split(',').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0 mt-1.5" />
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
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl shadow-sm h-full">
              <div className="text-sm font-semibold text-red-700 space-y-2">
                {echange.details.split('|')[1]?.trim().split(',').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2 flex-shrink-0 mt-1.5" />
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
