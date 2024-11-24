'use client'

import { Music2, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Track } from "@/types/spotify"

interface TrackCardProps {
  track: Track
  isPlaying: boolean
  onPlayPause: (previewUrl: string) => void
}

export function TrackCard({ track, isPlaying, onPlayPause }: TrackCardProps) {
  const energyHue = track.audioFeatures?.energy ? track.audioFeatures.energy * 120 : 0
  const duration = track.duration_ms ? Math.floor(track.duration_ms / 1000) : 0
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  const tempo = track.audioFeatures?.tempo ? Math.round(track.audioFeatures.tempo) : 'N/A'
  const energy = track.audioFeatures?.energy ? Math.round(track.audioFeatures.energy * 100) : 'N/A'

  const handleClick = () => {
    if (track.preview_url) {
      onPlayPause(track.preview_url)
    }
  }

  return (
    <div 
      className={`group flex flex-col sm:flex-row items-start sm:items-center gap-3 p-2 sm:p-4 rounded-lg bg-card hover:bg-accent/50 transition-colors ${
        track.preview_url ? 'cursor-pointer' : 'cursor-default'
      }`}
      onClick={handleClick}
    >
      {/* Left section: Play button, album art, and track info */}
      <div className="flex items-center gap-3 w-full sm:w-[40%] min-w-0">
        <div className="relative">
          {track.album?.images?.[0]?.url ? (
            <div className="relative">
              <img 
                src={track.album.images[0].url}
                alt={track.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-md shrink-0 object-cover"
              />
              <div className={`absolute inset-0 m-auto flex items-center justify-center h-8 w-8 opacity-0 group-hover:opacity-100 transition-all bg-black/40 rounded-md ${
                !track.preview_url ? 'cursor-not-allowed' : ''
              }`}>
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-white drop-shadow-lg" />
                ) : (
                  <Play className="h-4 w-4 text-white drop-shadow-lg" />
                )}
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-secondary flex items-center justify-center shrink-0">
              <Music2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-medium truncate text-sm sm:text-base">{track.name}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {track.artists?.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Right section: Metadata badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center w-full sm:w-[60%] sm:justify-end pl-[3.25rem] sm:pl-0">
        <Badge variant="outline" className="whitespace-nowrap text-xs sm:text-sm px-1.5 sm:px-2.5">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </Badge>
        
        <Badge variant="outline" className="whitespace-nowrap text-xs sm:text-sm px-1.5 sm:px-2.5">
          {tempo === 'N/A' ? 'N/A' : `${tempo} BPM`}
        </Badge>
        
        {track.audioFeatures?.camelotKey && (
          <Badge 
            variant="outline" 
            className="whitespace-nowrap font-mono text-xs sm:text-sm px-1.5 sm:px-2.5"
            title="Camelot Key"
          >
            {track.audioFeatures.camelotKey}
          </Badge>
        )}
        
        <Badge 
          variant="outline" 
          className="whitespace-nowrap text-xs sm:text-sm px-1.5 sm:px-2.5"
          style={{
            backgroundColor: energy === 'N/A' ? undefined : `hsla(${energyHue}, 70%, 50%, 0.2)`,
            borderColor: energy === 'N/A' ? undefined : `hsla(${energyHue}, 70%, 50%, 0.5)`
          }}
        >
          Energy: {energy === 'N/A' ? 'N/A' : `${energy}%`}
        </Badge>
      </div>
    </div>
  )
}