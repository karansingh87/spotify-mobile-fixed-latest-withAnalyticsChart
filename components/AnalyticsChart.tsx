'use client';

import { Track } from "@/types/spotify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlayCircle, PauseCircle } from "lucide-react";
import { useState } from "react";

interface Point {
  x: number;
  y: number;
  energy: number;
  track: Track;
}

function createSmoothPath(points: Point[]): string {
  if (points.length < 2) return '';

  const path = [];
  path.push(`M ${points[0].x} ${points[0].y}`);

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1];
    const currentPoint = points[i];

    const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
    const cp1y = prevPoint.y;
    const cp2x = prevPoint.x + 2 * (currentPoint.x - prevPoint.x) / 3;
    const cp2y = currentPoint.y;

    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`);
  }

  return path.join(' ');
}

interface AnalyticsChartProps {
  tracks: Track[];
  visible: boolean;
  playing: string | null;
  onPlayPause: (previewUrl: string) => void;
}

export function AnalyticsChart({ tracks, visible, playing, onPlayPause }: AnalyticsChartProps) {
  if (!tracks.length || !visible) return null;

  const [hoveredTrack, setHoveredTrack] = useState<Track | null>(null);

  const width = 800;
  const height = 400;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const energyData = tracks.map(track => track.audioFeatures?.energy || 0);
  const points: Point[] = energyData.map((energy, index) => ({
    x: padding + (index / (energyData.length - 1)) * chartWidth,
    y: padding + chartHeight - (energy * chartHeight),
    energy,
    track: tracks[index],
  }));

  const path = createSmoothPath(points);

  return (
    <div className="bg-card rounded-lg p-6 relative">
      {/* Mini Track Card */}
      {(hoveredTrack || playing) && (
        <div
          className="absolute top-2 right-4 p-2 rounded-md shadow-md flex items-center gap-2 transition-all duration-200"
          style={{
          
            border: '1px solid #1DB954', // Spotify green
            backgroundColor: 'hsla(var(--card), 0.15)', // Subtle background with UI hue
            // backdropFilter: 'blur(4px)', // Optional blur effect for a frosted glass look
            top: '1.5rem', // Adjust to align with subtitle
            right: `${padding}px`, // Align with the chart's right edge
          }}
        >
          {/* Album Artwork */}
          {(hoveredTrack?.album?.images?.[0]?.url ||
            playing) && (
              <img
                src={
                  hoveredTrack?.album?.images?.[0]?.url ||
                  tracks.find((track) => track.preview_url === playing)
                    ?.album?.images?.[0]?.url
                }
                alt="Track artwork"
                className="w-8 h-8 rounded-md object-cover"
              />
            )}

          {/* Track Details */}
          <div className="text-xs space-y-1 w-full truncate">
            <p className="font-semibold text-foreground truncate">
              {hoveredTrack?.name ||
                tracks.find((track) => track.preview_url === playing)
                  ?.name}
            </p>
            <p className="text-muted-foreground truncate">
              {hoveredTrack?.artists
                .map((a) => a.name)
                .join(', ') ||
                tracks
                  .find((track) => track.preview_url === playing)
                  ?.artists.map((a) => a.name)
                  .join(', ')}
            </p>
          </div>
        </div>
      )}

      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines (No Y-axis labels) */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
            const y = padding + chartHeight * (1 - tick);
            return (
              <g key={tick}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="hsl(var(--muted-foreground) / 0.1)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {tracks.map((_, index) => (
            <text
              key={index}
              x={padding + (index / (tracks.length - 1)) * chartWidth}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-muted-foreground/70"
            >
              {index + 1}
            </text>
          ))}

          {/* Main path */}
          <path
            d={path}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* Interactive points */}
          {points.map((point, index) => {
            const isPlaying = playing === point.track.preview_url;
            const hasPreview = !!point.track.preview_url;

            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g
                      onClick={() => hasPreview && onPlayPause(point.track.preview_url!)}
                      onMouseEnter={() => setHoveredTrack(point.track)}
                      onMouseLeave={() => setHoveredTrack(null)}
                      className={`${hasPreview ? 'cursor-pointer outline-none' : 'cursor-not-allowed'} group`}
                      tabIndex={-1} /* Remove tab focus */
                    >
                      {/* Data point */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="6" /* Smaller default radius */
                        fill="hsl(var(--background))"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                        className={`transition-all duration-200 ${
                          isPlaying ? 'opacity-0' : 'group-hover:opacity-0'
                        }`}
                      />

                      {/* Background circle to mask chart line (on hover or play) */}
                      {hasPreview && (isPlaying || hoveredTrack === point.track) && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="15" /* Background circle size */
                          fill="hsl(var(--card))" /* Matches chart background dynamically */
                          className={`transition-opacity duration-200 ${
                            isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      )}

                      {/* Circular Play/Pause button */}
                      {hasPreview && (
                        <foreignObject
                          x={point.x - 15}
                          y={point.y - 15}
                          width="30"
                          height="30"
                          className={`transition-opacity duration-200 ${
                            isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            {isPlaying ? (
                              <PauseCircle className="w-6 h-6 text-[#1DB954]" />
                            ) : (
                              <PlayCircle className="w-6 h-6 text-[#1DB954]" />
                            )}
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="flex items-center gap-2 p-2"
                    sideOffset={5}
                  >
                    {point.track.album?.images?.[0]?.url && (
                      <img 
                        src={point.track.album.images[0].url} 
                        alt=""
                        className="w-8 h-8 rounded-sm object-cover"
                      />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium text-xs leading-none">
                        {point.track.name}
                      </p>
                      <p className="text-xs text-muted-foreground leading-none">
                        {point.track.artists.map(a => a.name).join(', ')}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </svg>

        {/* Chart title */}
        <div className="absolute top-2 left-4 space-y-1">
          <h3 className="text-sm font-medium text-foreground">Energy Flow Analysis</h3>
          <p className="text-xs text-muted-foreground">Track progression with energy levels</p>
        </div>

        {/* Axis labels */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
          Track Sequence
        </div>
      </div>
    </div>
  );
}