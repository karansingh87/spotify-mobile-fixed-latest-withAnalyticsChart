'use client'

import { Button } from "@/components/ui/button"
import { Music2, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth"
import { openSpotifyLogin } from "@/lib/spotify"

export function SpotifyAuth() {
  const { isAuthenticated, isLoading, error, logout } = useSpotifyAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Button disabled variant="outline">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isAuthenticated ? (
        <Button onClick={logout} variant="destructive">
          Disconnect from Spotify
        </Button>
      ) : (
        <Button 
          onClick={openSpotifyLogin}
          className="bg-[#1DB954] hover:bg-[#1DB954]/90"
        >
          <Music2 className="mr-2 h-4 w-4" />
          Connect with Spotify
        </Button>
      )}
    </div>
  )
}