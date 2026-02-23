import Layout from '@/components/Layout';
import Loading from '@/components/ui/loading';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useDraftPicks } from '@/hooks/draft/useDraftPicks';
import { useDraftTypes } from '@/hooks/draft/useDraftTypes';
import { useDraftFilters } from '@/hooks/draft/useDraftFilters';
import { useMisAuBallotage } from '@/hooks/draft/useMisAuBallotage';
import { DraftFilters } from '@/components/draft/DraftFilters';
import { DraftTable } from '@/components/draft/DraftTable';
import { MisAuBallotageTable } from '@/components/draft/MisAuBallotageTable';
import { usePageLoading } from '@/hooks/usePageLoading';

export default function Draft(): JSX.Element {
  const {
    data: draftPicks,
    isLoading,
    error,
  } = useDraftPicks();

  const { data: types = [], isLoading: isTypesLoading } = useDraftTypes();

  // Use the custom hook for filtering logic
  const {
    annees,
    equipes,
    selectedYear,
    setSelectedYear,
    selectedType,
    setSelectedType,
    selectedRound,
    setSelectedRound,
    selectedEquipe,
    setSelectedEquipe,
    availableRounds,
    filteredPicksEquipe,
  } = useDraftFilters(draftPicks, types);

  const { data: misAuBallotage = [] } = useMisAuBallotage(selectedType, selectedYear);

  const filteredMisAuBallotage = selectedEquipe
    ? misAuBallotage.filter((e) => e.equipe_nom === selectedEquipe)
    : misAuBallotage;

  const selectedTypeName = types.find((t) => t.id === selectedType)?.nom ?? '';

  // Gestion automatique du loading de la page
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
  if (!draftPicks || draftPicks.length === 0) return <div>Aucun choix de repêchage trouvé</div>;

  return (
    <Layout
      maxWidth="max-w-5xl"
      containerPadding="px-2 sm:px-6 lg:px-8"
      mainPadding="pt-12 pb-12"
    >
      {/* Page Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          {/* Decorative accent */}
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-8 bg-cyan-400 rounded-full" />
            <div className="w-0.5 h-6 bg-cyan-400/60 rounded-full" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              Repêchage
              {' '}
              <span className="text-cyan-400">{selectedYear}</span>
            </h1>
          </div>
        </div>

        <p className="text-base text-muted-foreground ml-6 pl-2">
          Ordre de sélection et historique du repêchage
        </p>
      </div>

      {/* Filters */}
      <DraftFilters
        annees={annees}
        equipes={equipes}
        types={types}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedRound={selectedRound}
        setSelectedRound={setSelectedRound}
        selectedEquipe={selectedEquipe}
        setSelectedEquipe={setSelectedEquipe}
        availableRounds={availableRounds}
        isTypesLoading={isTypesLoading}
      />

      <div className="flex flex-col">
        {/* Mis au ballotage — before picks on desktop, after on mobile */}
        <div className="order-2 md:order-1">
          <MisAuBallotageTable entries={filteredMisAuBallotage} typeName={selectedTypeName} />
        </div>

        {/* Draft Table */}
        <div className="order-1 md:order-2 md:mt-12">
          <DraftTable
            filteredPicksEquipe={filteredPicksEquipe}
            selectedType={selectedType}
            selectedRound={selectedRound}
            availableRounds={availableRounds}
          />
        </div>
      </div>
    </Layout>
  );
}
