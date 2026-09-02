import { Children, cloneElement, isValidElement } from 'react';
import {
  LayoutDashboard, BarChart2, CalendarDays, History,
} from 'lucide-react';
import {
  Tabs, TabsList, TabsTrigger,
} from '@/components/ui/tabs';
import PlayerDetails from '@/types/IPlayerDetails';

type Props = {
  children: React.ReactElement<{ player: PlayerDetails }>[];
  player: PlayerDetails;
};

export default function JoueurTabs({ children, player }: Props) {
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { player });
    }
    return child;
  });

  return (
    <Tabs defaultValue="apercu" className="w-full">
      {/* Mobile: full-width icon + label grid / Desktop: inline icon + label */}
      <TabsList className="mb-4 w-full grid grid-cols-4 h-auto py-1 sm:w-auto sm:inline-flex sm:h-10 sm:py-0">
        <TabsTrigger value="apercu" className="flex flex-col items-center gap-0.5 text-xs py-1.5 sm:flex-row sm:gap-1.5 sm:text-sm sm:py-2 sm:px-3">
          <LayoutDashboard className="w-4 h-4" />
          <span>Aperçu</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex flex-col items-center gap-0.5 text-xs py-1.5 sm:flex-row sm:gap-1.5 sm:text-sm sm:py-2 sm:px-3">
          <BarChart2 className="w-4 h-4" />
          <span className="sm:hidden">Stats</span>
          <span className="hidden sm:inline">Statistiques</span>
        </TabsTrigger>
        <TabsTrigger value="derniers-matchs" className="flex flex-col items-center gap-0.5 text-xs py-1.5 sm:flex-row sm:gap-1.5 sm:text-sm sm:py-2 sm:px-3">
          <CalendarDays className="w-4 h-4" />
          <span className="sm:hidden">Matchs</span>
          <span className="hidden sm:inline">5 derniers matchs</span>
        </TabsTrigger>
        <TabsTrigger value="histoire" className="flex flex-col items-center gap-0.5 text-xs py-1.5 sm:flex-row sm:gap-1.5 sm:text-sm sm:py-2 sm:px-3">
          <History className="w-4 h-4" />
          <span>Histoire</span>
        </TabsTrigger>
      </TabsList>

      {childrenWithProps}
    </Tabs>
  );
}
