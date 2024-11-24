import type { Track, MixTemplate, MixGenerationParams, MixResult } from './types';
import { getCompatibleCamelotKeys } from './musicTheory';
import { MixContextAnalyzer } from './mixAnalyzer';
import { TEMPLATE_SETTINGS } from './templates';

export function calculateTrackScore(
  track: Track,
  template: MixTemplate,
  targetEnergy: number,
  currentTrack: Track | null,
  position: number
): number {
  const weights = template.weights;
  let score = 0;

  // Energy match
  const energyDiff = Math.abs(track.energy - targetEnergy);
  score += (1 - energyDiff) * weights.energy;

  // BPM match
  if (currentTrack) {
    const bpmDiff = Math.abs(track.tempo - currentTrack.tempo) / currentTrack.tempo;
    score += (1 - Math.min(bpmDiff, 1)) * weights.bpm;
  }

  // Camelot key match
  if (currentTrack) {
    const compatibleKeys = getCompatibleCamelotKeys(currentTrack.camelotKey);
    const keyMatch = compatibleKeys.includes(track.camelotKey) ? 1.0 : 0.0;
    score += keyMatch * weights.camelot;
  }

  // Other attributes
  score += track.danceability * weights.danceability;
  score += (track.loudness + 60) / 60 * weights.loudness;
  score += track.valence * weights.valence;
  score += track.acousticness * weights.acousticness;
  score += track.instrumentalness * weights.instrumentalness;
  score += (1 - track.speechiness) * weights.speechiness;

  return score;
}

export function getTargetEnergy(position: number, template: MixTemplate): number {
  const energyCurve = template.energyCurve;
  
  for (let i = 0; i < energyCurve.length - 1; i++) {
    if (position <= energyCurve[i + 1].position) {
      const pos1 = energyCurve[i].position;
      const pos2 = energyCurve[i + 1].position;
      const e1 = energyCurve[i].target;
      const e2 = energyCurve[i + 1].target;
      return e1 + (e2 - e1) * (position - pos1) / (pos2 - pos1);
    }
  }
  return energyCurve[energyCurve.length - 1].target;
}

export function generateMix(params: MixGenerationParams): MixResult {
  const {
    tracks,
    templateName,
    firstTrackId,
    durationType,
    targetDuration = 60,
    targetTracks = 15,
    minBpm,
    maxBpm
  } = params;

  const template = TEMPLATE_SETTINGS[templateName];
  const mixTracks: Track[] = [];
  let totalDuration = 0;
  let availableTracks = [...tracks];

  // Initialize context analyzer
  const context = new MixContextAnalyzer(template);

  // Apply BPM filtering
  if (minBpm) {
    availableTracks = availableTracks.filter(track => track.tempo >= minBpm);
  }
  if (maxBpm) {
    availableTracks = availableTracks.filter(track => track.tempo <= maxBpm);
  }

  if (availableTracks.length === 0) {
    throw new Error("No tracks available within the specified BPM range.");
  }

  // Select first track
  let currentTrack: Track;
  if (firstTrackId) {
    currentTrack = availableTracks.find(t => t.id === firstTrackId)!;
    if (!currentTrack) {
      throw new Error("Selected first track not found in the playlist.");
    }
  } else {
    const targetEnergy = getTargetEnergy(0, template);
    const trackScores = availableTracks.map(track => ({
      score: calculateTrackScore(track, template, targetEnergy, null, 0),
      track
    }));
    trackScores.sort((a, b) => b.score - a.score);
    currentTrack = trackScores[0].track;
  }

  // Add first track
  mixTracks.push(currentTrack);
  context.updateContext(currentTrack);
  totalDuration += currentTrack.duration;
  availableTracks = availableTracks.filter(t => t.id !== currentTrack.id);

  // Generate rest of mix
  while (availableTracks.length > 0) {
    // Check if mix is complete
    if (durationType === 'time' && totalDuration >= targetDuration) break;
    if (durationType === 'tracks' && mixTracks.length >= targetTracks) break;

    // Calculate position
    const position = durationType === 'time' 
      ? Math.min(totalDuration / targetDuration, 1.0)
      : Math.min(mixTracks.length / targetTracks, 1.0);

    const targetEnergy = getTargetEnergy(position, template);

    // Score tracks with context awareness
    const trackScores = availableTracks.map(track => {
      const templateScore = calculateTrackScore(
        track,
        template,
        targetEnergy,
        currentTrack,
        position
      );
      const contextScore = context.analyzeContext(track, position);
      const finalScore = (templateScore * 0.7) + (contextScore * 0.3);
      return { score: finalScore, track };
    });

    if (trackScores.length === 0) break;

    // Select next track
    trackScores.sort((a, b) => b.score - a.score);
    const nextTrack = trackScores[0].track;

    // Update mix and context
    mixTracks.push(nextTrack);
    context.updateContext(nextTrack);
    totalDuration += nextTrack.duration;
    availableTracks = availableTracks.filter(t => t.id !== nextTrack.id);
    currentTrack = nextTrack;
  }

  // Calculate mix statistics
  const stats = {
    totalDuration,
    avgEnergy: mixTracks.reduce((sum, t) => sum + t.energy, 0) / mixTracks.length,
    avgBpm: mixTracks.reduce((sum, t) => sum + t.tempo, 0) / mixTracks.length,
    energyRange: Math.max(...mixTracks.map(t => t.energy)) - Math.min(...mixTracks.map(t => t.energy)),
    bpmRange: Math.max(...mixTracks.map(t => t.tempo)) - Math.min(...mixTracks.map(t => t.tempo)),
    trackCount: mixTracks.length
  };

  return { tracks: mixTracks, stats };
}