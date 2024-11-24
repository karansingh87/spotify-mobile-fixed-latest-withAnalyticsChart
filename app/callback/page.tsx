'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial: { [key: string]: string }, item) => {
        const parts = item.split('=')
        initial[parts[0]] = decodeURIComponent(parts[1])
        return initial
      }, {})

    if (hash.access_token) {
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: 'SPOTIFY_TOKEN', 
            token: hash.access_token 
          }, 
          '*'
        )
        window.close()
      } else {
        localStorage.setItem('spotify_access_token', hash.access_token)
        router.push('/')
      }
    } else {
      console.error('No access token found in URL')
      if (window.opener) {
        window.opener.postMessage(
          { 
            type: 'SPOTIFY_ERROR', 
            error: 'No access token found' 
          }, 
          '*'
        )
        window.close()
      } else {
        router.push('/')
      }
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}