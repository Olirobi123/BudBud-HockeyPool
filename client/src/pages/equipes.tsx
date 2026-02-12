import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import Loading from '@/components/ui/loading';
import { ErrorDisplay } from '@/components/ui/error-display';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useDivisionStandings } from '@/hooks/equipes/useDivisionStandings';
import { useInactiveTeams } from '@/hooks/equipes/useInactiveTeams';
import { QuebecMap } from '@/components/equipes/QuebecMap';
import { DivisionStandings } from '@/components/equipes/DivisionStandings';
import { InactiveTeamsSection } from '@/components/equipes/InactiveTeamsSection';

export default function Equipes() {
  const [divisionFilter, setDivisionFilter] = useState<'nord' | 'sud' | null>(null);

  // Fetch standings for both divisions
  const {
    data: nordStandings,
    isLoading: isLoadingNord,
    error: errorNord,
  } = useDivisionStandings('nord');

  const {
    data: sudStandings,
    isLoading: isLoadingSud,
    error: errorSud,
  } = useDivisionStandings('sud');

  const {
    data: inactiveTeams,
    isLoading: isLoadingInactive,
  } = useInactiveTeams();

  // Page loading state
  usePageLoading({
    dependencies: [isLoadingNord, isLoadingSud, isLoadingInactive],
  });

  // Loading state
  if (isLoadingNord || isLoadingSud) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // Error state
  if (errorNord || errorSud) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorDisplay
          error={errorNord || errorSud}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const totalTeams = (nordStandings?.length || 0) + (sudStandings?.length || 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
          DIVISIONS
        </h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <p className="text-muted-foreground text-lg">Saison 2025-26</p>
          <Badge variant="outline" className="text-sm font-semibold">
            {totalTeams} équipes actives
          </Badge>
        </div>
      </div>

      {/* Main Layout: Map + Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-8 mb-8">
        {/* Quebec Map */}
        <div className="animate-fadeIn">
          <QuebecMap
            nordTeams={nordStandings || []}
            sudTeams={sudStandings || []}
            onRegionClick={setDivisionFilter}
            activeFilter={divisionFilter}
          />
        </div>

        {/* Division Standings */}
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <DivisionStandings
            nordStandings={nordStandings || []}
            sudStandings={sudStandings || []}
            divisionFilter={divisionFilter}
          />
        </div>
      </div>

      {/* Inactive Teams (Collapsible) */}
      <InactiveTeamsSection
        teams={inactiveTeams || []}
        isLoading={isLoadingInactive}
      />
    </Layout>
  );
}
