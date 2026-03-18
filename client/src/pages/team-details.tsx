import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, CalendarDays, ArrowLeftRight } from 'lucide-react';
import Layout from '@/components/Layout';
import Loading from '@/components/ui/loading';
import { useTeam, useTeamRoster, useTeamLatestTrade, useTeamDraftPicks } from '@/hooks/useTeam';
import { useInjuries } from '@/hooks/useInjuries';
import { useEtat } from '@/hooks/useEtat';
import { usePageLoading } from '@/hooks/usePageLoading';
import { TeamHeader } from '@/components/equipes/TeamHeader';
import { TeamRoster } from '@/components/equipes/TeamRoster';
import { TeamLatestTrade } from '@/components/equipes/TeamLatestTrade';
import { TeamTrophies } from '@/components/equipes/TeamTrophies';
import { TeamDraftPicks } from '@/components/equipes/TeamDraftPicks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import NotFound from '@/pages/not-found';

export default function TeamDetails() {
  let { id }= useParams();
   let idNum =  id != undefined && id.trim() != ""  ? parseInt(id.trim()) : 0;

  const { data: team, isLoading: isLoadingTeam, error: errorTeam } = useTeam(idNum);
  const { data: roster, isLoading: isLoadingRoster } = useTeamRoster(idNum);
  const { data: latestTrade, isLoading: isLoadingTrade } = useTeamLatestTrade(idNum);
  const { data: draftPicks, isLoading: isLoadingDraftPicks } = useTeamDraftPicks(idNum);
  const { data: injuries } = useInjuries();
  const { data: etat } = useEtat();

  // Gestion automatique du loading de la page
  usePageLoading({ dependencies: [isLoadingTeam] });

  if (isLoadingTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isNaN(idNum) || idNum === 0 || errorTeam || !team) {
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Back Button */}
      <Link to="/equipes">
        <Button variant="ghost" className="mb-6 hover:bg-transparent hover:text-blue-600 pl-0 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux équipes
        </Button>
      </Link>

      <TeamHeader team={team} />

      {/* Mobile: Tabs layout */}
      <div className="lg:hidden">
        <Tabs defaultValue="effectif">
          <TabsList className="w-full grid grid-cols-4 h-auto py-1">
            <TabsTrigger value="effectif" className="flex flex-col items-center gap-0.5 text-xs py-1.5 px-1">
              <Users className="w-4 h-4" />
              <span>Effectif</span>
            </TabsTrigger>
            <TabsTrigger value="trophees" className="flex flex-col items-center gap-0.5 text-xs py-1.5 px-1">
              <Trophy className="w-4 h-4" />
              <span>Trophées</span>
            </TabsTrigger>
            <TabsTrigger value="picks" className="flex flex-col items-center gap-0.5 text-xs py-1.5 px-1">
              <CalendarDays className="w-4 h-4" />
              <span>Picks</span>
            </TabsTrigger>
            <TabsTrigger value="transaction" className="flex flex-col items-center gap-0.5 text-xs py-1.5 px-1">
              <ArrowLeftRight className="w-4 h-4" />
              <span>Transaction</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="effectif" className="mt-4">
            <TeamRoster roster={roster || []} isLoading={isLoadingRoster} injuries={injuries} etat={etat} />
          </TabsContent>
          <TabsContent value="trophees" className="mt-4">
            <TeamTrophies teamId={idNum} />
          </TabsContent>
          <TabsContent value="picks" className="mt-4">
            <TeamDraftPicks picks={draftPicks || []} isLoading={isLoadingDraftPicks} />
          </TabsContent>
          <TabsContent value="transaction" className="mt-4">
            <TeamLatestTrade trades={latestTrade || []} isLoading={isLoadingTrade} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Grid layout with sticky sidebar */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-start">
        {/* Main Content: Roster (Left, larger) */}
        <div className="lg:col-span-2">
          <TeamRoster roster={roster || []} isLoading={isLoadingRoster} injuries={injuries} etat={etat} />
        </div>

        {/* Sidebar: sticky, no stretching */}
        <div className="space-y-6 self-start">
          <TeamTrophies teamId={idNum} />
          <TeamDraftPicks picks={draftPicks || []} isLoading={isLoadingDraftPicks} />
          <TeamLatestTrade trades={latestTrade || []} isLoading={isLoadingTrade} />
        </div>
      </div>
    </Layout>
  );
}
