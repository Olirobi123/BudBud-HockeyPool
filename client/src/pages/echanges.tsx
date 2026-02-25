import { ArrowLeftRight } from 'lucide-react';
import { useEchanges } from '@/hooks/echanges/useEchanges';
import { ErrorDisplay } from '@/components/ui/error-display';
import { EchangeList } from '@/components/echanges/EchangeList';
import Layout from '@/components/Layout';
import Loading from '@/components/ui/loading';
import { usePageLoading } from '@/hooks/usePageLoading';

function HeroBanner({ count }: { count: number }) {
  return (
    <div className="bg-slate-950 border-b border-slate-800/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 mb-3 font-medium">
          Ligue 38BudBud
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-black uppercase tracking-widest text-white leading-none mb-4">
          Échanges
        </h1>
        <p className="text-slate-400 text-sm tracking-wide mb-6">
          Historique des transactions
        </p>
        <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-slate-700 rounded-xl px-4 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-white font-bold text-sm">{count}</span>
          <span className="text-slate-400 text-sm">échanges confirmés</span>
        </div>
      </div>
    </div>
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
    <Layout beforeContainer={<HeroBanner count={confirmed.length} />}>
      <EchangeList echanges={confirmed} />
    </Layout>
  );
}
