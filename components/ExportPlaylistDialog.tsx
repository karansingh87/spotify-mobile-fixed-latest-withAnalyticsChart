'use client'

import { useState } from 'react'
import { spotifyApi } from '@/lib/spotify'
import { Track } from '@/types/spotify'
import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'

interface ExportPlaylistDialogProps {
  tracks: Track[]
  templateName: string
}

export function ExportPlaylistDialog({ tracks, templateName }: ExportPlaylistDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [playlistName, setPlaylistName] = useState(`${templateName} Mix`)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    if (!playlistName.trim()) {
      setError('Please enter a playlist name')
      return
    }

    setIsExporting(true)
    setError(null)

    try {
      // Create new playlist
      const { body: playlist } = await spotifyApi.createPlaylist(playlistName, {
        description: `Generated with Mix Master Pro using the ${templateName} template`,
        public: false
      })

      // Add tracks to playlist
      await spotifyApi.addTracksToPlaylist(
        playlist.id,
        tracks.map(track => track.uri)
      )

      setIsOpen(false)
    } catch (err) {
      console.error('Failed to export playlist:', err)
      setError('Failed to create playlist. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary"
          className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white border-0"
          size="icon"
        >
          <Save className="h-4 w-4" />
          <span className="sr-only">Save to Spotify</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Mix as Playlist</DialogTitle>
          <DialogDescription>
            Create a new Spotify playlist with your generated mix
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="playlist-name">Playlist Name</Label>
            <Input
              id="playlist-name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleExport}
            disabled={isExporting || !playlistName.trim()}
            className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Playlist'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}