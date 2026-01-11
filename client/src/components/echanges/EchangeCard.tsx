import React from 'react';
import { Calendar, ArrowLeftRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { EchangeStatusBadge } from './EchangeStatusBadge';
import { formatDate } from '@/lib/utils';
import Echange from '@/types/IEchange';

interface EchangeCardProps {
  echange: Echange;
}

export const EchangeCard: React.FC<EchangeCardProps> = ({ echange }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{formatDate(echange.date)}</span>
        </div>
        <EchangeStatusBadge statut_confirmer={echange.statut_confirmer} />
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">{echange.equipe_source_nom}</h3>
        </div>
        <div className="text-center">
          <ArrowLeftRight className="w-6 h-6 text-gray-400 mx-auto" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">{echange.equipe_destination_nom}</h3>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <div className="text-sm text-blue-700 space-y-1">
                {echange.details.split('|')[0]?.trim().split(',').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap">
                    {item.replace(/^.*?reçoit:?\s*/i, '').trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-gray-400">↔</span>
          </div>
          <div className="space-y-2">
            <div className="bg-red-100 p-3 rounded-lg">
              <div className="text-sm text-red-700 space-y-1">
                {echange.details.split('|')[1]?.trim().split(',').map((item, index) => (
                  <p key={index} className="whitespace-pre-wrap">
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
