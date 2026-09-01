import { ArrowLeftRight } from 'lucide-react';
import Echange from '@/types/IEchange';
import { useEchanges } from '@/hooks/echanges/useEchanges';
import useEchangesFilters from '@/hooks/echanges/useEchangesFilters';
import { ErrorDisplay } from '@/components/ui/error-display';
import { EchangeList } from '@/components/echanges/EchangeList';
import EchangeFilters from '@/components/echanges/EchangeFilters';
import Layout from '@/components/Layout';
import Loading from '@/components/ui/loading';
import { usePageLoading } from '@/hooks/usePageLoading';

function PageHeader({ count }: { count: number }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <div className="w-0.5 h-6 bg-primary/60 rounded-full" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
          Échanges
        </h1>
      </div>

      <p className="text-base text-muted-foreground ml-6 pl-2 mb-5">
        Historique des transactions
      </p>

      <div className="ml-6 pl-2">
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
          <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold tabular-nums text-foreground">{count}</span>
          <span className="text-sm text-muted-foreground">échanges confirmés</span>
        </div>
      </div>
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

  usePageLoading({ dependencies: [isLoading] });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const confirmed = (echanges ?? []).filter((e) => e.statut_confirmer);

  return (
    <Layout mainPadding="pt-12 pb-12">
      <PageHeader count={confirmed.length} />
      <EchangesContent confirmed={confirmed} />
    </Layout>
  );
}
