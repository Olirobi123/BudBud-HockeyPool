import { JSX } from 'react';
import Layout from '@/components/Layout';
import { TonightBoard } from '@/components/home/tonight/TonightBoard';
import { RegularHome } from '@/components/home/RegularHome';
import { DraftDayHome } from '@/components/home/draft-day/DraftDayHome';
import { Skeleton } from '@/components/ui/skeleton';
import { useDraftDayFlag } from '@/hooks/draft-day/useDraftDayFlag';

export default function Home(): JSX.Element {
  const { data: flag, isLoading } = useDraftDayFlag();

  if (isLoading) {
    return (
      <Layout hideTicker mainPadding="py-10">
        <Skeleton className="h-[60vh] w-full" />
      </Layout>
    );
  }

  // Jour du repêchage : bascule manuelle en BD (api_store, clé `draft_day`).
  if (flag?.actif === true) {
    return (
      <Layout mainPadding="py-10">
        <DraftDayHome annee={flag.annee} />
      </Layout>
    );
  }

  return (
    <Layout
      hideTicker
      beforeContainer={<TonightBoard />}
      mainPadding="py-10"
    >
      <RegularHome />
    </Layout>
  );
}
