'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Play, Pause } from "lucide-react"
import { useAudioPlayer } from "@/hooks/useAudioPlayer"

interface MixGeneratorProps {
  playlistId: string
  tracks: any[]
}

export function MixGenerator({ playlistId, tracks }: MixGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { playing, play } = useAudioPlayer()

  const handleGenerateMix = async () => {
    setIsGenerating(true)
    // Implement mix generation logic here
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Mix Generator</h2>
          <Button 
            onClick={handleGenerateMix}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Mix...
              </>
            ) : (
              'Generate Mix'
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {tracks.map((track: any) => (
            <div 
              key={track.id}
              className="flex items-center justify-between p-4 rounded-lg bg-muted"
            >
              <div className="flex items-center space-x-4">
                {track.album?.images?.[0]?.url && (
                  <img 
                    src={track.album.images[0].url}
                    alt={track.name}
                    className="w-12 h-12 rounded"
                  />
                )}
                <div>
                  <h3 className="font-medium">{track.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {track.artists?.map((artist: any) => artist.name).join(', ')}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => play(track.preview_url)}
                disabled={!track.preview_url}
              >
                {playing === track.preview_url ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}