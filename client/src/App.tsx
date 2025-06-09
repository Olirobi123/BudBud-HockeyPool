import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Switch, Route } from "wouter";
import { LoadingProvider } from "@/lib/loading-context";
import Loading from "@/components/ui/loading";
import { useLoading } from "@/lib/loading-context";

// Import des pages
import Home from "@/pages/home";
import Equipes from "@/pages/equipes";
import Draft from "@/pages/draft";
import Echanges from "@/pages/echanges";
import Joueur from "@/pages/joueur";
import NotFound from "@/pages/not-found";

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
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/equipes" component={Equipes} />
          <Route path="/draft" component={Draft} />
          <Route path="/echanges" component={Echanges} />
          <Route path="/joueur/:id" component={Joueur} />
          <Route component={NotFound} />
        </Switch>
      </LoadingProvider>
    </QueryClientProvider>
  );
}

export default App;
