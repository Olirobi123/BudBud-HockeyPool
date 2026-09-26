import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { ScrollToTop } from '@/components/navigation/ScrollToTop';

// Import des pages
import Home from '@/pages/home';
import Equipes from '@/pages/equipes';
import TeamDetails from '@/pages/team-details';
import Draft from '@/pages/draft';
import Echanges from '@/pages/echanges';
import Joueur from '@/pages/joueur';
import Series from '@/pages/series';
import Bilan from '@/pages/bilan';
import RegieRepechage from '@/pages/regie-repechage';
import NotFound from '@/pages/not-found';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
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

          {/* Séries éliminatoires */}
          <Route path="/series" element={<Series />} />

          {/* Bilan de saison */}
          <Route path="/bilan" element={<Bilan />} />

          {/* Régie du draft en direct — aucun lien n'y mène */}
          <Route path="/regie-repechage" element={<RegieRepechage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
