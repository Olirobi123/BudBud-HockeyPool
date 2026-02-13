import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import type { TeamStanding } from '@/types/IEquipes';

interface QuebecMapProps {
  nordTeams: TeamStanding[];
  sudTeams: TeamStanding[];
  onRegionClick: (division: 'nord' | 'sud' | null) => void;
  activeFilter: 'nord' | 'sud' | null;
}

export function QuebecMap({
  nordTeams,
  sudTeams,
  onRegionClick,
  activeFilter
}: QuebecMapProps) {
  // Division line at approximately 47th parallel (roughly Québec City latitude)
  // Positioned at about 55% down the real Quebec map (adjusted for new viewBox)
  const divisionLineY = 700;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Carte du Québec
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3">
        <div className="relative w-full" style={{ aspectRatio: '1188 / 1280' }}>
          {/* Background Quebec map */}
          <img
            src="/images/map_dark.svg"
            alt="Carte du Québec"
            className="w-full h-auto"
            style={{
              filter: 'brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg)',
              opacity: 0.25
            }}
          />

          {/* SVG Overlay for interactive regions */}
          <svg
            viewBox="0 0 1188 1280"
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          >
            {/* Nord Region (northern part - above division line) */}
            <g style={{ pointerEvents: 'auto' }}>
              <rect
                x="0"
                y="0"
                width="1188"
                height={divisionLineY}
                fill="hsl(217 91% 60%)"
                opacity={activeFilter === 'sud' ? 0.05 : 0.15}
                className="hover:opacity-25 transition-all duration-300 cursor-pointer"
                onClick={() => onRegionClick(activeFilter === 'nord' ? null : 'nord')}
                style={{
                  filter: activeFilter === 'nord' ? 'drop-shadow(0 0 12px hsl(217 91% 60%))' : 'none',
                  pointerEvents: 'auto'
                }}
              />

              {/* Nord Label */}
              <text
                x="594"
                y="380"
                textAnchor="middle"
                className="text-2xl font-black uppercase fill-foreground pointer-events-none select-none"
                style={{ letterSpacing: '0.15em', fontSize: '80px' }}
              >
                NORD
              </text>

              {/* Nord Team Count Badge */}
              <g transform="translate(594, 470)">
                {/* Main badge background */}
                <rect
                  x="-95"
                  y="-28"
                  width="190"
                  height="56"
                  rx="28"
                  fill="hsl(217 91% 60%)"
                  opacity="0.95"
                  className="pointer-events-none"
                />

                {/* Border */}
                <rect
                  x="-95"
                  y="-28"
                  width="190"
                  height="56"
                  rx="28"
                  fill="none"
                  stroke="hsl(217 91% 70%)"
                  strokeWidth="2"
                  opacity="0.5"
                  className="pointer-events-none"
                />

                {/* Text */}
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  className="fill-white pointer-events-none select-none"
                  style={{ fontSize: '32px', fontWeight: 700 }}
                >
                  {nordTeams.length} équipes
                </text>
              </g>
            </g>

            {/* Division Line - diagonal across Quebec at approximately Quebec City latitude */}
            <line
              x1="20"
              y1={divisionLineY}
              x2="1168"
              y2={divisionLineY + 20}
              stroke="hsl(var(--border))"
              strokeWidth="2"
              strokeDasharray="12 8"
              opacity="0.25"
              className="pointer-events-none"
            />

            {/* Sud Region (southern part - below division line) */}
            <g style={{ pointerEvents: 'auto' }}>
              <rect
                x="0"
                y={divisionLineY}
                width="1188"
                height={1280 - divisionLineY}
                fill="hsl(6 78% 57%)"
                opacity={activeFilter === 'nord' ? 0.05 : 0.15}
                className="hover:opacity-25 transition-all duration-300 cursor-pointer"
                onClick={() => onRegionClick(activeFilter === 'sud' ? null : 'sud')}
                style={{
                  filter: activeFilter === 'sud' ? 'drop-shadow(0 0 12px hsl(6 78% 57%))' : 'none',
                  pointerEvents: 'auto'
                }}
              />

              {/* Sud Label */}
              <text
                x="594"
                y="1000"
                textAnchor="middle"
                className="text-2xl font-black uppercase fill-foreground pointer-events-none select-none"
                style={{ letterSpacing: '0.15em', fontSize: '80px' }}
              >
                SUD
              </text>

              {/* Sud Team Count Badge */}
              <g transform="translate(594, 1090)">
                {/* Main badge background */}
                <rect
                  x="-95"
                  y="-28"
                  width="190"
                  height="56"
                  rx="28"
                  fill="hsl(6 78% 57%)"
                  opacity="0.95"
                  className="pointer-events-none"
                />

                {/* Border */}
                <rect
                  x="-95"
                  y="-28"
                  width="190"
                  height="56"
                  rx="28"
                  fill="none"
                  stroke="hsl(6 78% 67%)"
                  strokeWidth="2"
                  opacity="0.5"
                  className="pointer-events-none"
                />

                {/* Text */}
                <text
                  x="0"
                  y="8"
                  textAnchor="middle"
                  className="fill-white pointer-events-none select-none"
                  style={{ fontSize: '32px', fontWeight: 700 }}
                >
                  {sudTeams.length} équipes
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(217 91% 60%)', opacity: 0.4 }} />
            <span className="text-muted-foreground">Division Nord</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(6 78% 57%)', opacity: 0.4 }} />
            <span className="text-muted-foreground">Division Sud</span>
          </div>
          {activeFilter && (
            <button
              onClick={() => onRegionClick(null)}
              className="text-xs text-primary hover:underline"
            >
              ✕ Effacer le filtre
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
