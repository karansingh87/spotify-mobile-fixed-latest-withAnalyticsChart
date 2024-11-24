'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { spotifyApi, getPlaylistTracks } from "@/lib/spotify"
import { useQuery } from '@tanstack/react-query'
import { Loader2, Music2, Wand2, Save, BarChart2, LineChart } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrackCard } from "@/components/TrackCard"
import { Track } from "@/types/spotify"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"
import { MixSettingsDialog } from "@/components/MixSettingsDialog"
import { ProgressionCharts } from "@/components/ProgressionCharts"
import { AnalyticsChart } from "@/components/AnalyticsChart"
import { ExportPlaylistDialog } from "@/components/ExportPlaylistDialog"
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PlaylistSelector() {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)
  const [mixTracks, setMixTracks] = useState<Track[] | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showCharts, setShowCharts] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const { playing, play } = useAudioPlayer()
  const { login } = useSpotifyAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data: playlists, isLoading: isLoadingPlaylists, error: playlistsError, refetch: refetchPlaylists } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      try {
        const response = await spotifyApi.getUserPlaylists()
        return response.body.items
      } catch (err: any) {
        if (err?.statusCode === 401) {
          login()
        }
        throw err
      }
    },
    retry: false
  })

  const { data: tracks, isLoading: isLoadingTracks, error: tracksError } = useQuery({
    queryKey: ['playlist-tracks', selectedPlaylistId],
    queryFn: async () => {
      if (!selectedPlaylistId) return null
      return getPlaylistTracks(selectedPlaylistId)
    },
    enabled: !!selectedPlaylistId
  })

  const handleMixGenerated = (newMixTracks: Track[], templateName: string) => {
    setMixTracks(newMixTracks)
    setSelectedTemplate(templateName)
    setShowAnalytics(true)
    setShowCharts(false)
  }

  if (playlistsError || tracksError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {playlistsError ? 
            <div className="flex justify-between items-center">
              <span>Failed to load playlists</span>
              <Button variant="outline" size="sm" onClick={() => refetchPlaylists()}>
                Try Again
              </Button>
            </div> : 
            'Failed to load tracks'
          }
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-3 sm:space-y-4 px-4 sm:px-0 max-w-[calc(100vw-2rem)] sm:max-w-none mx-auto sm:mx-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Select a Playlist</h2>
        <Select
          value={selectedPlaylistId || ""}
          onValueChange={setSelectedPlaylistId}
          disabled={isLoadingPlaylists}
        >
          <SelectTrigger className="w-full">
            {isLoadingPlaylists ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading playlists...</span>
              </div>
            ) : (
              <SelectValue placeholder="Select a playlist" />
            )}
          </SelectTrigger>
          <SelectContent className="max-h-[50vh] w-[calc(100vw-2rem)] sm:w-full">
            {playlists?.map((playlist: any) => (
              <SelectItem key={playlist.id} value={playlist.id}>
                <div className="flex items-center space-x-3">
                  {playlist.images?.[0]?.url ? (
                    <img 
                      src={playlist.images[0].url} 
                      alt={playlist.name}
                      className="w-6 h-6 rounded"
                    />
                  ) : (
                    <Music2 className="h-6 w-6" />
                  )}
                  <span className="truncate">{playlist.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPlaylistId && (
        <div className="bg-background rounded-lg">
          <div className="p-2 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 px-1 sm:px-0">
              <h3 className="text-lg sm:text-xl font-semibold">
                {mixTracks ? 'Generated Mix' : 'Playlist Tracks'}
              </h3>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {mixTracks && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setShowAnalytics(!showAnalytics)}
                      className={showAnalytics ? 'bg-accent hover:bg-accent/80' : ''}
                    >
                      <LineChart className={`h-4 w-4 transition-colors ${showAnalytics ? 'text-accent-foreground' : ''}`} />
                      <span className="sr-only">
                        {showAnalytics ? "Hide Analytics" : "Show Analytics"}
                      </span>
                    </Button>

                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setShowCharts(!showCharts)}
                      className={showCharts ? 'bg-accent hover:bg-accent/80' : ''}
                    >
                      <BarChart2 className={`h-4 w-4 transition-colors ${showCharts ? 'text-accent-foreground' : ''}`} />
                      <span className="sr-only">
                        {showCharts ? "Hide Charts" : "Show Charts"}
                      </span>
                    </Button>
                    
                    <ExportPlaylistDialog 
                      tracks={mixTracks}
                      templateName={selectedTemplate}
                    />
                  </>
                )}

                <MixSettingsDialog 
                  tracks={tracks || []}
                  onMixGenerated={handleMixGenerated}
                />
              </div>
            </div>
            
            {isLoadingTracks ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Loading tracks...
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-16rem)] sm:h-[800px] pr-1 sm:pr-4 [&_[data-radix-scroll-area-scrollbar]]:w-1.5 [&_[data-radix-scroll-area-thumb]]:bg-muted-foreground/20 [&_[data-radix-scroll-area-thumb]]:hover:bg-muted-foreground/25 [&_[data-radix-scroll-area-thumb]]:transition-colors">
                <div className="space-y-4 sm:space-y-6">
                  {mixTracks && (
                    <>
                      <AnalyticsChart 
                        tracks={mixTracks} 
                        visible={showAnalytics}
                        playing={playing}
                        onPlayPause={play}
                      />
                      <ProgressionCharts tracks={mixTracks} visible={showCharts} />
                    </>
                  )}
                  <div className="space-y-2 sm:space-y-3">
                    {(mixTracks || tracks)?.map((track: Track) => (
                      <TrackCard
                        key={`${track.id}-${track.uri}`}
                        track={track}
                        isPlaying={playing === track.preview_url}
                        onPlayPause={play}
                      />
                    ))}
                  </div>
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      )}
    </div>
  )
}