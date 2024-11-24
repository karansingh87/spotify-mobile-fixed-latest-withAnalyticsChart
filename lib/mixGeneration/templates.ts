import type { MixTemplate } from './types';

export const TEMPLATE_SETTINGS: { [key: string]: MixTemplate } = {
  'Warm Up (Opening Set)': {
    description: 'Perfect for opening sets, gradually building energy from deep, melodic tracks.',
    energyCurve: [
      { position: 0.0, target: 0.3, range: 0.15 },
      { position: 0.3, target: 0.4, range: 0.15 },
      { position: 0.6, target: 0.5, range: 0.15 },
      { position: 1.0, target: 0.6, range: 0.15 }
    ],
    weights: {
      energy: 0.25,
      bpm: 0.25,
      camelot: 0.20,
      danceability: 0.10,
      acousticness: 0.08,
      instrumentalness: 0.05,
      valence: 0.04,
      loudness: 0.02,
      speechiness: 0.01
    },
    bpmRange: 8,
    preferMinorKeys: true,
    genreGroups: {
      early: ['deep house', 'organic house', 'minimal deep tech'],
      mid: ['melodic house', 'deep house', 'progressive house'],
      peak: ['progressive house', 'house', 'melodic techno'],
      closing: ['deep house', 'melodic house', 'organic house']
    }
  },

  'Peak Time (Prime Time)': {
    description: 'High-energy, peak hour material for maximum dancefloor impact.',
    energyCurve: [
      { position: 0.0, target: 0.7, range: 0.15 },
      { position: 0.3, target: 0.8, range: 0.15 },
      { position: 0.7, target: 0.9, range: 0.15 },
      { position: 1.0, target: 0.85, range: 0.15 }
    ],
    weights: {
      energy: 0.30,
      danceability: 0.25,
      bpm: 0.20,
      camelot: 0.10,
      loudness: 0.05,
      valence: 0.05,
      acousticness: 0.02,
      instrumentalness: 0.02,
      speechiness: 0.01
    },
    bpmRange: 4,
    preferMinorKeys: false,
    genreGroups: {
      early: ['tech house', 'peak time house', 'big room house'],
      mid: ['techno', 'peak time techno', 'tech house'],
      peak: ['peak time techno', 'hard techno', 'industrial techno'],
      closing: ['techno', 'tech house', 'peak time house']
    }
  },

  'Progressive Journey': {
    description: 'Smooth, continuous energy progression with focus on musical storytelling.',
    energyCurve: [
      { position: 0.0, target: 0.4, range: 0.15 },
      { position: 0.2, target: 0.5, range: 0.15 },
      { position: 0.4, target: 0.6, range: 0.15 },
      { position: 0.6, target: 0.7, range: 0.15 },
      { position: 0.8, target: 0.8, range: 0.15 },
      { position: 1.0, target: 0.75, range: 0.15 }
    ],
    weights: {
      energy: 0.25,
      bpm: 0.20,
      camelot: 0.25,
      danceability: 0.10,
      instrumentalness: 0.08,
      valence: 0.05,
      acousticness: 0.03,
      loudness: 0.02,
      speechiness: 0.02
    },
    bpmRange: 6,
    preferMinorKeys: null,
    genreGroups: {
      early: ['progressive house', 'melodic house', 'organic house'],
      mid: ['progressive house', 'melodic techno', 'progressive trance'],
      peak: ['melodic techno', 'progressive trance', 'progressive house'],
      closing: ['melodic house', 'progressive house', 'organic house']
    }
  },

  'Tale Of Us': {
    description: 'Dark, hypnotic melodic techno with dramatic builds and ethereal moments.',
    energyCurve: [
      { position: 0.0, target: 0.5, range: 0.15 },
      { position: 0.2, target: 0.6, range: 0.15 },
      { position: 0.4, target: 0.7, range: 0.15 },
      { position: 0.5, target: 0.65, range: 0.15 },
      { position: 0.7, target: 0.85, range: 0.15 },
      { position: 0.9, target: 0.75, range: 0.15 },
      { position: 1.0, target: 0.8, range: 0.15 }
    ],
    weights: {
      energy: 0.30,
      bpm: 0.25,
      camelot: 0.20,
      instrumentalness: 0.10,
      danceability: 0.08,
      acousticness: 0.02,
      valence: 0.02,
      loudness: 0.02,
      speechiness: 0.01
    },
    bpmRange: 4,
    preferMinorKeys: true,
    genreGroups: {
      early: ['melodic techno', 'deep techno', 'minimal techno'],
      mid: ['melodic techno', 'progressive techno', 'peak time techno'],
      peak: ['industrial techno', 'hard techno', 'peak time techno'],
      closing: ['melodic techno', 'ambient techno', 'deep techno']
    }
  },

  'Underground Club': {
    description: 'Dark, techy vibes with consistent groove and energy.',
    energyCurve: [
      { position: 0.0, target: 0.6, range: 0.15 },
      { position: 0.3, target: 0.7, range: 0.15 },
      { position: 0.7, target: 0.8, range: 0.15 },
      { position: 1.0, target: 0.75, range: 0.15 }
    ],
    weights: {
      energy: 0.30,
      bpm: 0.25,
      camelot: 0.20,
      instrumentalness: 0.10,
      danceability: 0.08,
      loudness: 0.03,
      valence: 0.02,
      acousticness: 0.01,
      speechiness: 0.01
    },
    bpmRange: 5,
    preferMinorKeys: true,
    genreGroups: {
      early: ['minimal techno', 'deep tech house', 'dub techno'],
      mid: ['minimal techno', 'techno', 'tech house'],
      peak: ['techno', 'dark techno', 'industrial techno'],
      closing: ['minimal techno', 'dub techno', 'deep techno']
    }
  },

  'Black Coffee': {
    description: 'Sophisticated Afro-house journey with perfect BPM control and deep, soulful progression.',
    energyCurve: [
      { position: 0.0, target: 0.80, range: 0.20 },
      { position: 0.2, target: 0.75, range: 0.20 },
      { position: 0.4, target: 0.85, range: 0.20 },
      { position: 0.6, target: 0.90, range: 0.20 },
      { position: 0.8, target: 0.85, range: 0.20 },
      { position: 1.0, target: 0.80, range: 0.20 }
    ],
    weights: {
      energy: 0.25,
      danceability: 0.35,
      bpm: 0.20,
      camelot: 0.08,
      valence: 0.05,
      loudness: 0.03,
      acousticness: 0.02,
      instrumentalness: 0.01,
      speechiness: 0.01
    },
    bpmRange: 3,
    preferMinorKeys: null,
    genreGroups: {
      early: ['deep house', 'afro house', 'organic house'],
      mid: ['afro house', 'tribal house', 'afro tech'],
      peak: ['afro tech', 'tech house', 'tribal house'],
      closing: ['afro house', 'deep house', 'melodic house']
    }
  },

  'Solomun Style': {
    description: 'Deep, melodic progression with focus on storytelling and emotional peaks.',
    energyCurve: [
      { position: 0.0, target: 0.5, range: 0.15 },
      { position: 0.2, target: 0.65, range: 0.15 },
      { position: 0.4, target: 0.75, range: 0.15 },
      { position: 0.6, target: 0.85, range: 0.15 },
      { position: 0.8, target: 0.80, range: 0.15 },
      { position: 1.0, target: 0.70, range: 0.15 }
    ],
    weights: {
      energy: 0.25,
      camelot: 0.25,
      danceability: 0.20,
      bpm: 0.15,
      valence: 0.05,
      instrumentalness: 0.05,
      loudness: 0.03,
      acousticness: 0.01,
      speechiness: 0.01
    },
    bpmRange: 6,
    preferMinorKeys: true,
    genreGroups: {
      early: ['deep house', 'melodic house', 'organic house'],
      mid: ['melodic house', 'indie dance', 'deep tech house'],
      peak: ['melodic techno', 'peak time house', 'electronica'],
      closing: ['melodic house', 'deep house', 'organic house']
    }
  },

  'Afterlife': {
    description: 'Ethereal, dramatic melodic techno with epic breakdowns and emotional crescendos.',
    energyCurve: [
      { position: 0.0, target: 0.45, range: 0.15 },
      { position: 0.2, target: 0.60, range: 0.15 },
      { position: 0.4, target: 0.80, range: 0.15 },
      { position: 0.5, target: 0.70, range: 0.15 },
      { position: 0.7, target: 0.90, range: 0.15 },
      { position: 0.9, target: 0.75, range: 0.15 },
      { position: 1.0, target: 0.65, range: 0.15 }
    ],
    weights: {
      energy: 0.30,
      camelot: 0.25,
      bpm: 0.20,
      instrumentalness: 0.10,
      danceability: 0.05,
      valence: 0.05,
      loudness: 0.03,
      acousticness: 0.01,
      speechiness: 0.01
    },
    bpmRange: 4,
    preferMinorKeys: true,
    genreGroups: {
      early: ['melodic techno', 'organic house', 'deep techno'],
      mid: ['melodic techno', 'progressive techno', 'electronica'],
      peak: ['peak time techno', 'melodic techno', 'progressive trance'],
      closing: ['ambient techno', 'melodic techno', 'deep techno']
    }
  }
};