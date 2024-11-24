export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface AudioFeatures {
  // Basic features
  tempo: number;
  energy: number;
  key: number;
  mode: number;
  camelotKey: string;
  
  // Additional features
  acousticness: number;
  danceability: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
  timeSignature: number;
  duration_ms: number;
  analysis_url: string;
  id: string;
  track_href: string;
  type: string;
  uri: string;
}

export interface Track {
  id: string;
  name: string;
  preview_url: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  audioFeatures?: AudioFeatures;
  genres?: string[];
}