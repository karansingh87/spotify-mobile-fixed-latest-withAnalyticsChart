'use client'

import { SpotifyAuth } from "@/components/SpotifyAuth"
import { PlaylistSelector } from "@/components/PlaylistSelector"
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth"
import { Music4 } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function Home() {
  const { isAuthenticated, isLoading } = useSpotifyAuth()

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music4 className="h-8 sm:h-10 w-8 sm:w-10" />
            <h1 className="text-3xl sm:text-4xl font-bold">Mix Master Pro</h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground">Create amazing mixes with intelligent track analysis</p>
        </div>

        {isAuthenticated ? (
          <PlaylistSelector />
        ) : (
          <SpotifyAuth />
        )}
      </div>
    </div>
  )
}