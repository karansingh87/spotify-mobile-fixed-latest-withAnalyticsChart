export const KEY_MAP: { [key: number]: string } = {
  0: 'C',
  1: 'C♯/D♭',
  2: 'D',
  3: 'D♯/E♭',
  4: 'E',
  5: 'F',
  6: 'F♯/G♭',
  7: 'G',
  8: 'G♯/A♭',
  9: 'A',
  10: 'A♯/B♭',
  11: 'B'
};

export const CAMELOT_WHEEL: { [key: string]: string } = {
  '0,1': '8B',   // C Major
  '0,0': '5A',   // C Minor
  '1,1': '3B',   // C#/Db Major
  '1,0': '12A',  // C#/Db Minor
  '2,1': '10B',  // D Major
  '2,0': '7A',   // D Minor
  '3,1': '5B',   // D#/Eb Major
  '3,0': '2A',   // D#/Eb Minor
  '4,1': '12B',  // E Major
  '4,0': '9A',   // E Minor
  '5,1': '7B',   // F Major
  '5,0': '4A',   // F Minor
  '6,1': '2B',   // F#/Gb Major
  '6,0': '11A',  // F#/Gb Minor
  '7,1': '9B',   // G Major
  '7,0': '6A',   // G Minor
  '8,1': '4B',   // G#/Ab Major
  '8,0': '1A',   // G#/Ab Minor
  '9,1': '11B',  // A Major
  '9,0': '8A',   // A Minor
  '10,1': '6B',  // A#/Bb Major
  '10,0': '3A',  // A#/Bb Minor
  '11,1': '1B',  // B Major
  '11,0': '10A'  // B Minor
};

export function getCompatibleCamelotKeys(camelotKey: string): string[] {
  if (!camelotKey || camelotKey === 'Unknown') {
    return [];
  }
  
  const keyNumber = parseInt(camelotKey.slice(0, -1));
  const keyLetter = camelotKey.slice(-1);
  const compatibleKeys = [camelotKey];
  
  if (keyLetter === 'A') {
    compatibleKeys.push(`${keyNumber}B`);
  } else {
    compatibleKeys.push(`${keyNumber}A`);
  }
  
  const keyNumberUp = keyNumber < 12 ? keyNumber + 1 : 1;
  const keyNumberDown = keyNumber > 1 ? keyNumber - 1 : 12;
  
  compatibleKeys.push(
    `${keyNumberUp}${keyLetter}`,
    `${keyNumberDown}${keyLetter}`
  );
  
  return compatibleKeys;
}