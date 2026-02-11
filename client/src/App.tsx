import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from '@/lib/queryClient';
import { LoadingProvider, useLoading } from '@/lib/loading-context';
import Loading from '@/components/ui/loading';

// Import des pages
import Home from '@/pages/home';
import Equipes from '@/pages/equipes';
import TeamDetails from '@/pages/team-details';
import Draft from '@/pages/draft';
import Echanges from '@/pages/echanges';
import Joueur from '@/pages/joueur';
import NotFound from '@/pages/not-found';

function LoadingOverlay() {
  const { isPageLoading } = useLoading();

  if (!isPageLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <Loading className="min-h-screen" />
    </div>
  );
}

function App() {
  return (
     <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <LoadingOverlay />
        <BrowserRouter>
          <Routes>
            {/* Route principale */}
            <Route path="/" element={<Home />} />

            {/* Routes équipes */}
            <Route path="/equipes" element={<Equipes />} />
            <Route path="/equipes/:id" element={<TeamDetails />} />

            {/* Autres pages */}
            <Route path="/draft" element={<Draft />} />
            <Route path="/echanges" element={<Echanges />} />

            {/* Route joueurs */}
            <Route path="/joueur/:id" element={<Joueur />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </QueryClientProvider>
  );
}

export default App;
