interface CamelotMapping {
  key: number;
  mode: number;
}

const CAMELOT_WHEEL: Record<string, CamelotMapping> = {
  '8A': { key: 0, mode: 1 },  // C Major
  '8B': { key: 0, mode: 0 },  // C Minor
  '3A': { key: 7, mode: 1 },  // G Major
  '3B': { key: 7, mode: 0 },  // G Minor
  '10A': { key: 2, mode: 1 }, // D Major
  '10B': { key: 2, mode: 0 }, // D Minor
  '5A': { key: 9, mode: 1 },  // A Major
  '5B': { key: 9, mode: 0 },  // A Minor
  '12A': { key: 4, mode: 1 }, // E Major
  '12B': { key: 4, mode: 0 }, // E Minor
  '7A': { key: 11, mode: 1 }, // B Major
  '7B': { key: 11, mode: 0 }, // B Minor
  '2A': { key: 6, mode: 1 },  // F♯/G♭ Major
  '2B': { key: 6, mode: 0 },  // F♯/G♭ Minor
  '9A': { key: 1, mode: 1 },  // D♭/C♯ Major
  '9B': { key: 1, mode: 0 },  // D♭/C♯ Minor
  '4A': { key: 8, mode: 1 },  // A♭/G♯ Major
  '4B': { key: 8, mode: 0 },  // A♭/G♯ Minor
  '11A': { key: 3, mode: 1 }, // E♭/D♯ Major
  '11B': { key: 3, mode: 0 }, // E♭/D♯ Minor
  '6A': { key: 10, mode: 1 }, // B♭/A♯ Major
  '6B': { key: 10, mode: 0 }, // B♭/A♯ Minor
  '1A': { key: 5, mode: 1 },  // F Major
  '1B': { key: 5, mode: 0 },  // F Minor
};

export function getCamelotKey(key: number, mode: number): string {
  for (const [camelotKey, value] of Object.entries(CAMELOT_WHEEL)) {
    if (value.key === key && value.mode === mode) {
      return camelotKey;
    }
  }
  return 'N/A';
}