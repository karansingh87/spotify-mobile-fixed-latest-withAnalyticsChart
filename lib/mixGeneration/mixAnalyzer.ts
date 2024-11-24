import type { Track, MixTemplate } from './types';

export class MixContextAnalyzer {
  private template: MixTemplate;
  private history: {
    energy: number[];
    genres: string[][];
    keys: string[];
    valence: number[];
  };
  private maxHistory: number;

  constructor(template: MixTemplate) {
    this.template = template;
    this.history = {
      energy: [],
      genres: [],
      keys: [],
      valence: []
    };
    this.maxHistory = 5;
  }

  updateContext(track: Track): void {
    this.history.energy.push(track.energy);
    this.history.genres.push(track.genres);
    this.history.keys.push(track.camelotKey);
    this.history.valence.push(track.valence);

    // Keep history limited
    Object.keys(this.history).forEach(key => {
      this.history[key as keyof typeof this.history] = 
        this.history[key as keyof typeof this.history].slice(-this.maxHistory);
    });
  }

  analyzeContext(track: Track, position: number): number {
    if (!Object.values(this.history).some(arr => arr.length > 0)) {
      return 1.0; // First track
    }

    let contextScore = 0.0;

    // Energy progression
    if (this.history.energy.length > 0) {
      const currentTrend = this.history.energy[this.history.energy.length - 1] - this.history.energy[0];
      const trackContinuesTrend = (
        (currentTrend > 0 && track.energy >= this.history.energy[this.history.energy.length - 1]) ||
        (currentTrend < 0 && track.energy <= this.history.energy[this.history.energy.length - 1])
      );
      contextScore += trackContinuesTrend ? 0.3 : 0;
    }

    // Genre compatibility
    if (this.history.genres.length > 0) {
      const lastGenres = new Set(
        this.history.genres.flat()
      );
      const genreMatch = track.genres.some(g => lastGenres.has(g));
      contextScore += genreMatch ? 0.2 : 0;
    }

    return contextScore;
  }
}