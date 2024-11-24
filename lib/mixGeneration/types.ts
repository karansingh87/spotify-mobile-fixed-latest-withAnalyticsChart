export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  previewUrl: string | null;
  tempo: number;
  key: number;
  mode: number;
  camelotKey: string;
  energy: number;
  danceability: number;
  valence: number;
  loudness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  uri: string;
  genres: string[];
}

export interface MixTemplate {
  description: string;
  energyCurve: {
    position: number;
    target: number;
    range: number;
  }[];
  weights: {
    energy: number;
    bpm: number;
    camelot: number;
    danceability: number;
    acousticness: number;
    instrumentalness: number;
    valence: number;
    loudness: number;
    speechiness: number;
  };
  bpmRange: number;
  preferMinorKeys: boolean | null;
  genreGroups: {
    early: string[];
    mid: string[];
    peak: string[];
    closing: string[];
  };
}

export interface MixGenerationParams {
  tracks: Track[];
  templateName: string;
  firstTrackId?: string;
  durationType: 'time' | 'tracks';
  targetDuration?: number;
  targetTracks?: number;
  minBpm?: number;
  maxBpm?: number;
}

export interface MixResult {
  tracks: Track[];
  stats: MixStats;
}

export interface MixStats {
  totalDuration: number;
  avgEnergy: number;
  avgBpm: number;
  energyRange: number;
  bpmRange: number;
  trackCount: number;
}