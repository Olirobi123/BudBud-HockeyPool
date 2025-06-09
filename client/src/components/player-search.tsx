import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, User, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

interface NHLPlayer {
  playerId: string;
  name: string;
  positionCode: string;
  teamAbbrev: string;
  lastTeamId: string;
  lastTeamAbbrev: string;
  sweaterNumber: number;
  active: boolean;
}

async function searchPlayers(query: string): Promise<NHLPlayer[]> {
  if (!query || query.length < 2) return [];
  const response = await fetch(`/api/search/players?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur de recherche');
  return response.json();
}

interface PlayerSearchProps {
  onPlayerSelect?: (player: NHLPlayer) => void;
  placeholder?: string;
  className?: string;
}

export default function PlayerSearch({ 
  onPlayerSelect, 
  placeholder = "Rechercher un joueur...",
  className = ""
}: PlayerSearchProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  const { data: players, isLoading, error } = useQuery<NHLPlayer[]>({
    queryKey: ['players', search],
    queryFn: () => searchPlayers(search),
    enabled: search.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSelect = (player: NHLPlayer) => {
    setIsOpen(false);
    setSearch("");
    if (onPlayerSelect) {
      onPlayerSelect(player);
    } else {
      setLocation(`/joueur/${player.playerId}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsOpen(value.length >= 2);
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "C": return "bg-blue-100 text-blue-800";
      case "L": case "R": return "bg-green-100 text-green-800";
      case "D": return "bg-purple-100 text-purple-800";
      case "G": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={handleInputChange}
          className="pl-9 bg-slate-800 border-slate-600 text-white placeholder-gray-400 focus:border-primary"
          onFocus={() => search.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {isOpen && search.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto bg-white border-slate-200 shadow-lg">
          <CardContent className="p-0">
            {error ? (
              <div className="p-4 text-center text-red-600">
                Erreur lors de la recherche. Vérifiez votre connexion.
              </div>
            ) : players?.length ? (
              <div className="divide-y divide-gray-100">
                {players.map((player) => (
                  <div
                    key={player.playerId}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => handleSelect(player)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{player.name}</div>
                          {player.teamAbbrev && (
                            <div className="text-sm text-gray-500">
                              {player.teamAbbrev}
                              {player.sweaterNumber && ` #${player.sweaterNumber}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={getPositionColor(player.positionCode)}>
                        {player.positionCode}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : search.length >= 2 && !isLoading ? (
              <div className="p-4 text-center text-gray-500">
                Aucun joueur trouvé pour "{search}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}