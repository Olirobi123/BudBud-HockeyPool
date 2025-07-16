import {
  Users, Calendar, Clock, Trophy, Star,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useLoading } from '@/lib/loading-context';
import Loading from '@/components/ui/loading';
import { useDraftPicks } from '@/hooks/draft/useDraftPicks';
import { useDraftTypes } from '@/hooks/draft/useDraftTypes';
import { DraftPick, DraftType } from '@/types/IDraft';
import { useDraftFilters } from '@/hooks/draft/useDraftFilters';
import { DraftFilters } from '@/components/draft/DraftFilters';
import { DraftTable } from '@/components/draft/DraftTable';

export default function Draft() {
  const { setPageLoading } = useLoading();
  const hasLoaded = useRef(false);

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

  useEffect(() => {
    if (!isLoading && !hasLoaded.current) {
      hasLoaded.current = true;
      setPageLoading(false);
    }
  }, [isLoading, setPageLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Erreur:
        {(error as Error).message}
      </div>
    );
  }
  if (!draftPicks || draftPicks.length === 0) return <div>Aucun choix de repêchage trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              Repêchage
              {selectedYear}
            </h1>
            <p className="text-gray-600 mb-6">Ordre de sélection et historique du repêchage</p>
            {/* Use DraftFilters component */}
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
          </div>

          {/* Tableau style joueur-tabs-stats */}
          <DraftTable
            filteredPicksEquipe={filteredPicksEquipe}
            selectedType={selectedType}
            selectedRound={selectedRound}
            availableRounds={availableRounds}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
