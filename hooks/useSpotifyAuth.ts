'use client'

import { useState, useEffect } from 'react'
import { spotifyApi, openSpotifyLogin } from '@/lib/spotify'

const TOKEN_EXPIRY_BUFFER = 300000 // 5 minutes in milliseconds

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearAuth = () => {
    try {
      localStorage.removeItem('spotify_access_token')
      localStorage.removeItem('spotify_token_expiry')
      spotifyApi.setAccessToken('')
      setIsAuthenticated(false)
      setError(null)
    } catch (err) {
      console.error('Error clearing auth:', err)
    }
  }

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      await spotifyApi.getMe()
      return true
    } catch (err: any) {
      if (err?.statusCode === 401) {
        clearAuth()
      }
      return false
    }
  }

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SPOTIFY_TOKEN') {
        const { token } = event.data
        try {
          // Set expiry to slightly less than 1 hour from now
          const expiry = Date.now() + (3600 * 1000) - TOKEN_EXPIRY_BUFFER
          localStorage.setItem('spotify_access_token', token)
          localStorage.setItem('spotify_token_expiry', expiry.toString())
          spotifyApi.setAccessToken(token)
          setIsAuthenticated(true)
          setError(null)
        } catch (err) {
          console.error('Error setting token:', err)
          setError('Failed to store authentication token')
        }
      } else if (event.data?.type === 'SPOTIFY_ERROR') {
        setError(event.data.error)
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Check for existing token and validate it
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('spotify_access_token')
        const tokenExpiry = localStorage.getItem('spotify_token_expiry')
        
        if (token && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry, 10)
          
          // If token is expired or will expire soon, clear auth
          if (Date.now() >= expiryTime) {
            clearAuth()
          } else {
            spotifyApi.setAccessToken(token)
            // Validate token with Spotify
            const isValid = await validateToken(token)
            setIsAuthenticated(isValid)
          }
        }
      } catch (err) {
        console.error('Error reading token:', err)
        clearAuth()
        setError('Failed to restore previous session')
      } finally {
        setIsLoading(false)
      }
    }
    
    initAuth()

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const login = () => {
    clearAuth()
    openSpotifyLogin()
  }

  const logout = () => {
    clearAuth()
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  }
}