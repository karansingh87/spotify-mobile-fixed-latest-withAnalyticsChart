import type { Track, AudioFeatures } from '@/types/spotify';
import { getCamelotKey } from './camelot';
import SpotifyWebApi from 'spotify-web-api-node';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  redirectUri: `${getBaseUrl()}/callback`
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let rateLimitQueue: Promise<void> = Promise.resolve();
const enqueueRequest = async <T>(fn: () => Promise<T>): Promise<T> => {
  const request = rateLimitQueue.then(async () => {
    await delay(500);
    return fn();
  });
  rateLimitQueue = request.catch(() => {});
  return request;
};

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  retries = 5,
  backoff = 2000
): Promise<T> => {
  try {
    return await enqueueRequest(fn);
  } catch (error: any) {
    if (retries === 0) throw error;
    
    if (error?.statusCode === 429) {
      const retryAfter = parseInt(error.headers?.['retry-after'] || '5') * 1000;
      await delay(retryAfter);
    } else {
      await delay(backoff);
    }
    
    return retryWithBackoff(fn, retries - 1, backoff * 2);
  }
};

export const openSpotifyLogin = () => {
  const width = 450;
  const height = 730;
  const left = (window.screen.width / 2) - (width / 2);
  const top = (window.screen.height / 2) - (height / 2);

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'token',
    redirect_uri: `${getBaseUrl()}/callback`,
    scope: [
      'playlist-read-private',
      'user-library-read',
      'playlist-modify-public',
      'playlist-modify-private'
    ].join(' '),
    show_dialog: 'true'
  });

  const url = `https://accounts.spotify.com/authorize?${params.toString()}`;

  window.open(
    url,
    'Spotify Login',
    `width=${width},height=${height},top=${top},left=${left}`
  );
};

export const getUserPlaylists = async () => {
  try {
    const data = await retryWithBackoff(() => spotifyApi.getUserPlaylists());
    return data.body.items;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    throw new Error('Failed to fetch playlists');
  }
};

export const getArtistGenres = async (artistIds: string[]) => {
  if (!artistIds.length) return new Map();
  
  try {
    const chunks = [];
    for (let i = 0; i < artistIds.length; i += 50) {
      chunks.push(artistIds.slice(i, i + 50));
    }

    const genresMap = new Map<string, string[]>();
    
    for (const chunk of chunks) {
      const response = await retryWithBackoff(() => 
        spotifyApi.getArtists(chunk)
      );
      
      if (response.body?.artists) {
        response.body.artists.forEach(artist => {
          if (artist?.genres) {
            genresMap.set(artist.id, artist.genres);
          }
        });
      }
      
      await delay(500);
    }

    return genresMap;
  } catch (error) {
    console.error('Error fetching artist genres:', error);
    return new Map();
  }
};

export const getAudioFeatures = async (trackIds: string[]) => {
  if (!trackIds.length) return [];
  
  try {
    const chunks = [];
    for (let i = 0; i < trackIds.length; i += 50) {
      chunks.push(trackIds.slice(i, i + 50));
    }

    const allFeatures = [];
    for (const chunk of chunks) {
      try {
        const response = await retryWithBackoff(() => 
          spotifyApi.getAudioFeaturesForTracks(chunk)
        );
        
        if (response.body?.audio_features) {
          const features = response.body.audio_features.map(feature => {
            if (!feature) return null;
            return {
              tempo: feature.tempo,
              energy: feature.energy,
              key: feature.key,
              mode: feature.mode,
              camelotKey: getCamelotKey(feature.key, feature.mode),
              acousticness: feature.acousticness,
              danceability: feature.danceability,
              instrumentalness: feature.instrumentalness,
              liveness: feature.liveness,
              loudness: feature.loudness,
              speechiness: feature.speechiness,
              valence: feature.valence,
              timeSignature: feature.time_signature,
              duration_ms: feature.duration_ms,
              analysis_url: feature.analysis_url,
              id: feature.id,
              track_href: feature.track_href,
              type: feature.type,
              uri: feature.uri
            } as AudioFeatures;
          });
          allFeatures.push(...features);
        }
        
        await delay(500);
      } catch (error) {
        allFeatures.push(...Array(chunk.length).fill(null));
      }
    }

    return allFeatures;
  } catch (error) {
    console.error('Error fetching audio features:', error);
    return trackIds.map(() => null);
  }
};

export const getPlaylistTracks = async (playlistId: string): Promise<Track[]> => {
  try {
    const data = await retryWithBackoff(() => 
      spotifyApi.getPlaylistTracks(playlistId)
    );
    
    const uniqueTracks = new Map();
    data.body.items.forEach(item => {
      if (item.track) {
        uniqueTracks.set(item.track.id, item.track);
      }
    });
    
    const tracks = Array.from(uniqueTracks.values());
    
    const trackIds = tracks.map(track => track.id);
    const audioFeatures = await getAudioFeatures(trackIds);
    
    const artistIds = [...new Set(
      tracks.flatMap(track => track.artists.map(artist => artist.id))
    )];
    const artistGenres = await getArtistGenres(artistIds);

    const tracksWithFeatures = tracks.map((track, index) => ({
      ...track,
      audioFeatures: audioFeatures[index] || undefined,
      genres: [...new Set(
        track.artists
          .map(artist => artistGenres.get(artist.id) || [])
          .flat()
      )]
    }));
    
    return tracksWithFeatures;
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw new Error('Failed to fetch playlist tracks');
  }
};

export { spotifyApi };