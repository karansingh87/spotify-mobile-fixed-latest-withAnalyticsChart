import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const redirectUri = 'http://localhost:3000/api/auth/callback'
  const scope = 'playlist-read-private user-library-read playlist-modify-public playlist-modify-private'
  
  const params = new URLSearchParams({
    client_id: clientId!,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope,
    show_dialog: 'true'
  })

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
  
  return NextResponse.json({ authUrl })
}