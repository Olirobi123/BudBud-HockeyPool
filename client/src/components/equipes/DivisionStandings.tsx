import { DivisionTable } from './DivisionTable';
import type { TeamStanding } from '@/types/IEquipes';

interface DivisionStandingsProps {
  nordStandings: TeamStanding[];
  sudStandings: TeamStanding[];
  divisionFilter: 'nord' | 'sud' | null;
}

export function DivisionStandings({
  nordStandings,
  sudStandings,
  divisionFilter,
}: DivisionStandingsProps) {
  const showNord = divisionFilter === null || divisionFilter === 'nord';
  const showSud = divisionFilter === null || divisionFilter === 'sud';
  const dimNord = divisionFilter !== null && divisionFilter !== 'nord';
  const dimSud = divisionFilter !== null && divisionFilter !== 'sud';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Nord Division */}
      {showNord && (
        <div
          className="transition-opacity duration-300"
          style={{ opacity: dimNord ? 0.4 : 1 }}
        >
          <DivisionTable
            division="nord"
            standings={nordStandings}
            color="hsl(217 91% 60%)"
          />
        </div>
      )}

      {/* Sud Division */}
      {showSud && (
        <div
          className="transition-opacity duration-300"
          style={{ opacity: dimSud ? 0.4 : 1 }}
        >
          <DivisionTable
            division="sud"
            standings={sudStandings}
            color="hsl(6 78% 57%)"
          />
        </div>
      )}
    </div>
  );
}
