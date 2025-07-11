import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Clock, Trophy, Star } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { useLoading } from "@/lib/loading-context";
import { useEffect, useRef, useState } from "react";
import Loading from "@/components/ui/loading";

interface DraftPick {
  annee: number;
  type_id: number;
  rang: number;
  round: number;
  nom: string;
  joueur: string;
}

// Fonction pour récupérer les choix de repêchage
const fetchDraftPicks = async (): Promise<DraftPick[]> => {
  const response = await fetch('/api/repechage');
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des choix de repêchage');
  }
  return response.json();
};

export default function Draft() {
  const { setPageLoading } = useLoading();
  const hasLoaded = useRef(false);
  
  const { 
    data: draftPicks, 
    isLoading,
    error 
  } = useQuery<DraftPick[]>({
    queryKey: ['draftPicks'],
    queryFn: fetchDraftPicks
  });

  // Ajout du hook pour charger dynamiquement les types de repêchage
  const { data: types = [], isLoading: isTypesLoading } = useQuery<{ id: number, nom: string }[]>({
    queryKey: ["typesRepechage"],
    queryFn: async () => {
      const res = await fetch("/api/repechage/types");
      if (!res.ok) throw new Error("Erreur lors de la récupération des types de repêchage");
      return res.json();
    },
  });

  // Ajout des états pour l'année et le type sélectionnés
  const annees = Array.from(new Set(draftPicks?.map(pick => pick.annee))).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(annees[0]);
  const [selectedType, setSelectedType] = useState(types[0]?.id ?? 1);
  // Correction du sélecteur de ronde pour type 2 :
  // - Affiche "Toutes les rondes" (valeur 0) et chaque ronde réelle
  // - Utilise 0 pour signifier "toutes les rondes"
  const [selectedRound, setSelectedRound] = useState(0);
  // Ajout d'un état pour filtrer par équipe
  const equipes = Array.from(new Set(draftPicks?.map(pick => pick.nom))).sort();
  const [selectedEquipe, setSelectedEquipe] = useState<string>("");

  // Filtrer selon l'année et le type sélectionnés
  const currentYearPicks = draftPicks?.filter(pick => pick.annee === selectedYear && pick.type_id === selectedType);
  
  // Détermination des rondes disponibles pour le type 2
  const availableRounds = currentYearPicks && selectedType === 2
    ? Array.from(new Set(currentYearPicks.map(pick => pick.round))).sort((a, b) => a - b)
    : [];

  // Correction du filtrage :
  const filteredPicks = selectedType === 2 && selectedRound !== 0
    ? currentYearPicks?.filter(pick => pick.round === selectedRound)
    : currentYearPicks;

  // Filtrage selon équipe sélectionnée
  const filteredPicksEquipe = selectedEquipe
    ? filteredPicks?.filter(pick => pick.nom === selectedEquipe)
    : filteredPicks;

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

  if (error) return <div>Erreur: {(error as Error).message}</div>;
  if (!draftPicks || draftPicks.length === 0) return <div>Aucun choix de repêchage trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Repêchage {selectedYear}</h1>
            <p className="text-gray-600 mb-6">Ordre de sélection et historique du repêchage</p>
            <div className="flex flex-wrap gap-4 items-end bg-white rounded-lg shadow p-4 border border-gray-200 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Année</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                >
                  {annees.map(annee => (
                    <option key={annee} value={annee}>{annee}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Type</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                  value={selectedType}
                  onChange={e => {
                    setSelectedType(Number(e.target.value));
                    setSelectedRound(0);
                  }}
                >
                  {isTypesLoading ? (
                    <option>Chargement...</option>
                  ) : (
                    types.map(type => (
                      <option key={type.id} value={type.id}>{type.nom}</option>
                    ))
                  )}
                </select>
              </div>
              {selectedType === 2 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Ronde</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                    value={selectedRound}
                    onChange={e => setSelectedRound(Number(e.target.value))}
                  >
                    <option value={0}>Toutes les rondes</option>
                    {availableRounds.map(round => (
                      <option key={round} value={round}>Ronde {round}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Équipe</label>
                <select
                  className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
                  value={selectedEquipe}
                  onChange={e => setSelectedEquipe(e.target.value)}
                >
                  <option value="">Toutes</option>
                  {equipes.map(equipe => (
                    <option key={equipe} value={equipe}>{equipe}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tableau style joueur-tabs-stats */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-2 font-normal text-gray-700 text-left">Rang</th>
                  <th className="py-2 px-2 font-normal text-gray-700 text-left">Équipe</th>
                  <th className="py-2 px-2 font-normal text-gray-700 text-left">Joueur</th>
                </tr>
              </thead>
              <tbody>
                {filteredPicksEquipe && filteredPicksEquipe.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-400">Aucun choix pour cette sélection</td>
                  </tr>
                ) : selectedType === 2 && filteredPicksEquipe ? (
                  availableRounds
                    .filter(round => selectedRound === 0 || round === selectedRound)
                    .map(round => [
                      <tr key={`header-round-${round}`} className="bg-gray-50 border-t-2 border-gray-300">
                        <td colSpan={3} className="py-2 px-2 font-semibold text-gray-600 text-left uppercase tracking-wider">Ronde {round}</td>
                      </tr>,
                      ...filteredPicksEquipe
                        .filter(pick => pick.round === round)
                        .map((pick) => (
                          <tr key={pick.rang} className="border-b border-gray-100 hover:bg-gray-50 transition">
                            <td className="py-2 px-2 text-gray-800">{pick.rang}</td>
                            <td className="py-2 px-2 text-gray-700">{pick.nom}</td>
                            <td className="py-2 px-2 text-gray-900">{pick.joueur}</td>
                          </tr>
                        ))
                    ])
                ) : (
                  filteredPicksEquipe && filteredPicksEquipe.map((pick) => (
                    <tr key={pick.rang} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-2 px-2 text-gray-800">{pick.rang}</td>
                      <td className="py-2 px-2 text-gray-700">{pick.nom}</td>
                      <td className="py-2 px-2 text-gray-900">{pick.joueur}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}