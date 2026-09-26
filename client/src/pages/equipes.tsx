import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useDivisionStandings } from '@/hooks/equipes/useDivisionStandings';
import { useInactiveTeams } from '@/hooks/equipes/useInactiveTeams';
import { QuebecMap } from '@/components/equipes/QuebecMap';
import { DivisionStandings } from '@/components/equipes/DivisionStandings';
import { DivisionStandingsSkeleton } from '@/components/equipes/DivisionStandingsSkeleton';
import { InactiveTeamsSection } from '@/components/equipes/InactiveTeamsSection';
import { getCurrentSeasonLabel } from '@/lib/season';

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

  const isLoading = isLoadingNord || isLoadingSud;
  const error = errorNord ?? errorSud;
  const totalTeams = (nordStandings?.length ?? 0) + (sudStandings?.length ?? 0);

  return (
    <Layout>
      {/* Hero Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
          DIVISIONS
        </h1>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <p className="text-muted-foreground text-lg">Saison {getCurrentSeasonLabel()}</p>
          {!isLoading && error === null && (
            <Badge variant="outline" className="text-sm font-semibold">
              {totalTeams} équipes actives
            </Badge>
          )}
        </div>
      </div>

      {error !== null && !isLoading ? (
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      ) : (
        <>
          {/* Main Layout: Map + Standings */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 mb-8">
            {/* The map is static geography — it does not wait on the standings. */}
            <div className="animate-fadeIn lg:sticky lg:top-4 self-start">
              <QuebecMap
                nordTeams={nordStandings ?? []}
                sudTeams={sudStandings ?? []}
                onRegionClick={setDivisionFilter}
                activeFilter={divisionFilter}
                isLoading={isLoading}
              />
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              {isLoading ? (
                <DivisionStandingsSkeleton />
              ) : (
                <DivisionStandings
                  nordStandings={nordStandings ?? []}
                  sudStandings={sudStandings ?? []}
                  divisionFilter={divisionFilter}
                />
              )}
            </div>
          </div>

          <InactiveTeamsSection
            teams={inactiveTeams ?? []}
            isLoading={isLoadingInactive}
          />
        </>
      )}
    </Layout>
  );
}
