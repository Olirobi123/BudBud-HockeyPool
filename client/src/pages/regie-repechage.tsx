import { JSX, useState } from 'react';
import Layout from '@/components/Layout';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorDisplay, InlineError } from '@/components/ui/error-display';
import { RegieCurrentPick } from '@/components/draft-regie/RegieCurrentPick';
import { RegiePickRow } from '@/components/draft-regie/RegiePickRow';
import { DraftBoardSkeleton } from '@/components/home/draft-day/DraftBoardSkeleton';
import { useActiveTeams } from '@/hooks/useActiveTeams';
import { useDraftBoard } from '@/hooks/draft-day/useDraftBoard';
import { useDraftRegieMutations } from '@/hooks/draft-day/useDraftRegieMutations';
import { useDraftDayFlag } from '@/hooks/draft-day/useDraftDayFlag';
import { formatAnnee } from '@/lib/utils';

/**
 * Régie du draft en direct. Aucune navigation n'y mène : on y accède par l'URL
 * /regie-repechage. Pas d'authentification (voulu).
 */
export default function RegieRepechage(): JSX.Element {
  const { data: flag } = useDraftDayFlag();
  const { data: picks, isLoading, error } = useDraftBoard();
  const { data: equipes = [], isLoading: equipesLoading } = useActiveTeams();
  const { setEquipe, setJoueur, clearJoueur } = useDraftRegieMutations();
  const [busyRang, setBusyRang] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const run = (rang: number, action: () => Promise<unknown>) => {
    setBusyRang(rang);
    setLastError(null);
    action()
      .catch((err: unknown) => setLastError(err instanceof Error ? err.message : 'Erreur inconnue'))
      .finally(() => setBusyRang(null));
  };

  const current = picks?.find((p) => p.joueur === null) ?? null;
  const rounds = (picks ?? [])
    .map((p) => p.round)
    .filter((round, i, all) => all.indexOf(round) === i);

  const renderContent = (): JSX.Element => {
    if (isLoading || equipesLoading) return <DraftBoardSkeleton />;
    if (error !== null) return <ErrorDisplay error={error} />;
    return (
      <div className="space-y-8">
        <RegieCurrentPick
          pick={current}
          isBusy={current !== null && busyRang === current.rang}
          onPlayerPick={(player) => {
            if (current) run(current.rang, () => setJoueur.mutateAsync({ rang: current.rang, nhlPlayerId: player.nhlPlayerId }));
          }}
        />
        {lastError !== null && <InlineError message={lastError} />}
        {rounds.map((round) => (
          <section key={round} aria-labelledby={`regie-ronde-${round}`} className="rounded-lg border border-border bg-card">
            <h2 id={`regie-ronde-${round}`} className="border-b border-border px-3 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {`Ronde ${round}`}
            </h2>
            <ol className="divide-y divide-border/60">
              {(picks ?? []).filter((p) => p.round === round).map((pick) => (
                <RegiePickRow
                  key={pick.rang}
                  pick={pick}
                  equipes={equipes}
                  isOnTheClock={pick.rang === current?.rang}
                  isBusy={busyRang === pick.rang}
                  onTeamChange={(equipeId) => run(pick.rang, () => setEquipe.mutateAsync({ rang: pick.rang, equipeId }))}
                  onPlayerPick={(player) => run(pick.rang, () => setJoueur.mutateAsync({ rang: pick.rang, nhlPlayerId: player.nhlPlayerId }))}
                  onClear={() => run(pick.rang, () => clearJoueur.mutateAsync({ rang: pick.rang }))}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>
    );
  };

  return (
    <Layout hideTicker mainPadding="py-10">
      <PageHeader
        title="Régie du repêchage"
        subtitle={flag ? `Repêchage annuel ${formatAnnee(flag.annee)} — les changements sont visibles sur la home en direct` : undefined}
      />
      {renderContent()}
    </Layout>
  );
}
