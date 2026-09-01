import { ArrowLeftRight } from 'lucide-react';
import Echange from '@/types/IEchange';
import { useEchanges } from '@/hooks/echanges/useEchanges';
import useEchangesFilters from '@/hooks/echanges/useEchangesFilters';
import { ErrorDisplay } from '@/components/ui/error-display';
import { EchangeList } from '@/components/echanges/EchangeList';
import { EchangeListSkeleton } from '@/components/echanges/EchangeListSkeleton';
import EchangeFilters from '@/components/echanges/EchangeFilters';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';

function TradeCount({ count }: { count: number }): JSX.Element {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-bold tabular-nums text-foreground">{count}</span>
      <span className="text-sm text-muted-foreground">échanges confirmés</span>
    </div>
  );
}

interface EchangesContentProps {
  confirmed: Echange[];
}

function EchangesContent({ confirmed }: EchangesContentProps) {
  const {
    teams,
    years,
    selectedTeam,
    setSelectedTeam,
    selectedYear,
    setSelectedYear,
    filtered,
    hasActiveFilter,
  } = useEchangesFilters(confirmed);

  const handleReset = () => {
    setSelectedTeam('');
    setSelectedYear('');
  };

  return (
    <>
      <EchangeFilters
        teams={teams}
        years={years}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        hasActiveFilter={hasActiveFilter}
        onReset={handleReset}
        filteredCount={filtered.length}
      />
      <EchangeList echanges={filtered} isFiltered={hasActiveFilter} />
    </>
  );
}

export default function Echanges() {
  const {
    data: echanges,
    isLoading,
    error,
  } = useEchanges();


  const confirmed = (echanges ?? []).filter((e) => e.statut_confirmer);

  return (
    <Layout mainPadding="pt-12 pb-12">
      <PageHeader title="Échanges" subtitle="Historique des transactions">
        {!isLoading && error === null && <TradeCount count={confirmed.length} />}
      </PageHeader>
      {isLoading && <EchangeListSkeleton />}
      {!isLoading && error && (
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      )}
      {!isLoading && !error && <EchangesContent confirmed={confirmed} />}
    </Layout>
  );
}
