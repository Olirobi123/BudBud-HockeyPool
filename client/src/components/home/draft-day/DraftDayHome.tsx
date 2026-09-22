import { JSX } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { formatAnnee } from '@/lib/utils';
import { DraftBoardSection } from './DraftBoardSection';
import { RankingLists } from './RankingLists';

interface DraftDayHomeProps {
  annee: number;
}

/** Home temporaire du jour du repêchage — la home habituelle revient quand le flag est éteint. */
// eslint-disable-next-line import/prefer-default-export
export function DraftDayHome({ annee }: DraftDayHomeProps): JSX.Element {
  return (
    <>
      <PageHeader
        title="Jour du repêchage"
        subtitle={`Repêchage annuel ${formatAnnee(annee)} — mis à jour en direct`}
      />
      <div className="space-y-12">
        <DraftBoardSection />
        <RankingLists />
      </div>
    </>
  );
}
