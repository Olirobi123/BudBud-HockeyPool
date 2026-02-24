import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import Loading from '@/components/ui/loading';
import { useTeam, useTeamRoster, useTeamLatestTrade, useTeamDraftPicks } from '@/hooks/useTeam';
import { usePageLoading } from '@/hooks/usePageLoading';
import { TeamHeader } from '@/components/equipes/TeamHeader';
import { TeamRoster } from '@/components/equipes/TeamRoster';
import { TeamLatestTrade } from '@/components/equipes/TeamLatestTrade';
import { TeamTrophies } from '@/components/equipes/TeamTrophies';
import { TeamDraftPicks } from '@/components/equipes/TeamDraftPicks';
import { Button } from '@/components/ui/button';

import NotFound from '@/pages/not-found';

export default function TeamDetails() {
  let { id }= useParams();
   let idNum =  id != undefined && id.trim() != ""  ? parseInt(id.trim()) : 0;

  const { data: team, isLoading: isLoadingTeam, error: errorTeam } = useTeam(idNum);
  const { data: roster, isLoading: isLoadingRoster } = useTeamRoster(idNum);
  const { data: latestTrade, isLoading: isLoadingTrade } = useTeamLatestTrade(idNum);
  const { data: draftPicks, isLoading: isLoadingDraftPicks } = useTeamDraftPicks(idNum);

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Roster (Left, larger) */}
        <div className="lg:col-span-2">
          <TeamRoster roster={roster || []} isLoading={isLoadingRoster} />
        </div>

        {/* Sidebar: Trophies & Latest Trade */}
        <div className="space-y-6">
          <TeamTrophies teamId={idNum} />
          <TeamLatestTrade trade={latestTrade || null} isLoading={isLoadingTrade} />
          <TeamDraftPicks picks={draftPicks || []} isLoading={isLoadingDraftPicks} />
        </div>
      </div>
    </Layout>
  );
}
