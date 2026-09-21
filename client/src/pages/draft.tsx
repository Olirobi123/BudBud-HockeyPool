import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useDraftPicks } from '@/hooks/draft/useDraftPicks';
import { useDraftTypes } from '@/hooks/draft/useDraftTypes';
import { useDraftFilters } from '@/hooks/draft/useDraftFilters';
import { useMisAuBallotage } from '@/hooks/draft/useMisAuBallotage';
import { useBallotageYears } from '@/hooks/draft/useBallotageYears';
import { DraftFilters } from '@/components/draft/DraftFilters';
import { DraftTable } from '@/components/draft/DraftTable';
import { DraftTableSkeleton } from '@/components/draft/DraftTableSkeleton';
import { MisAuBallotageTable } from '@/components/draft/MisAuBallotageTable';

export default function Draft(): JSX.Element {
  const {
    data: draftPicks,
    isLoading,
    error,
  } = useDraftPicks();

  const { data: types = [], isLoading: isTypesLoading } = useDraftTypes();
  const { data: ballotageYears } = useBallotageYears();

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
  } = useDraftFilters(draftPicks, types, ballotageYears);

  const { data: misAuBallotage = [], isLoading: isBallotageLoading } = useMisAuBallotage(selectedType, selectedYear);

  const filteredMisAuBallotage = selectedEquipe
    ? misAuBallotage.filter((e) => e.equipe_nom === selectedEquipe)
    : misAuBallotage;

  const selectedTypeName = types.find((t) => t.id === selectedType)?.nom ?? '';

  const hasPicks = draftPicks !== undefined && draftPicks.length > 0;

  return (
    <Layout
      maxWidth="max-w-5xl"
      containerPadding="px-2 sm:px-6 lg:px-8"
      mainPadding="pt-12 pb-12"
    >
      <PageHeader
        title={(
          <>
            Repêchage
            {selectedYear !== undefined && (
              <>
                {' '}
                <span className="text-primary">{selectedYear}</span>
              </>
            )}
          </>
        )}
        subtitle="Ordre de sélection et historique du repêchage"
      />

      {isLoading && <DraftTableSkeleton />}

      {!isLoading && error !== null && (
        <ErrorDisplay error={error} onRetry={() => window.location.reload()} />
      )}

      {!isLoading && error === null && !hasPicks && (
        <p className="text-muted-foreground">Aucun choix de repêchage trouvé</p>
      )}

      {!isLoading && error === null && hasPicks && (
        <>
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

          <div className="flex flex-col gap-12">
            {/* Mis au ballotage — always on top */}
            <MisAuBallotageTable
              entries={filteredMisAuBallotage}
              typeName={selectedTypeName}
              isLoading={isBallotageLoading}
            />

            <DraftTable
              filteredPicksEquipe={filteredPicksEquipe}
              selectedType={selectedType}
              selectedRound={selectedRound}
              availableRounds={availableRounds}
            />
          </div>
        </>
      )}
    </Layout>
  );
}
