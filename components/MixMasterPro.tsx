'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaylistSelector } from "@/components/PlaylistSelector"
import { MixGenerator } from "@/components/MixGenerator"

export function MixMasterPro() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)
  const [tracks, setTracks] = useState([])

  return (
    <Tabs defaultValue="playlist-selection" className="w-full max-w-4xl mx-auto">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="playlist-selection" className="text-lg">
          Playlist Selection
        </TabsTrigger>
        <TabsTrigger 
          value="mix-generator" 
          className="text-lg"
          disabled={!selectedPlaylist}
        >
          Mix Generator
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="playlist-selection">
        <PlaylistSelector
          onPlaylistSelect={setSelectedPlaylist}
          onTracksLoaded={setTracks}
        />
      </TabsContent>
      
      <TabsContent value="mix-generator">
        <MixGenerator 
          playlistId={selectedPlaylist!}
          tracks={tracks}
        />
      </TabsContent>
    </Tabs>
  )
}