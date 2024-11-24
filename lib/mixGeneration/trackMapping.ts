import type { Track as SpotifyTrack } from '@/types/spotify';
import type { Track as MixTrack } from './types';

export function convertSpotifyTrackToMixTrack(track: SpotifyTrack): MixTrack | null {
  if (!track.audioFeatures) return null;

  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    album: track.album.name,
    duration: track.duration_ms / 1000, // Convert to seconds
    previewUrl: track.preview_url,
    tempo: track.audioFeatures.tempo,
    key: track.audioFeatures.key,
    mode: track.audioFeatures.mode,
    camelotKey: track.audioFeatures.camelotKey,
    energy: track.audioFeatures.energy,
    danceability: track.audioFeatures.danceability,
    valence: track.audioFeatures.valence,
    loudness: track.audioFeatures.loudness,
    acousticness: track.audioFeatures.acousticness,
    instrumentalness: track.audioFeatures.instrumentalness,
    liveness: track.audioFeatures.liveness,
    speechiness: track.audioFeatures.speechiness,
    uri: track.audioFeatures.uri,
    genres: track.genres || []
  };
}