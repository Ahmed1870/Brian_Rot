/** Audio stem keyframes (frame = start on the 720-frame timeline). Files live in /public. */
export type Stem = {file: string; frame: number; volume: number; note: string};

export const VOICE = {file: 'voiceover.wav', volume: 1};

export const STEMS: Stem[] = [
  {file: 'drone_28hz.mp3', frame: 0, volume: 0.9, note: 'Low sub-bass drone (28Hz) - loops exactly every 24s'},
  {file: 'glass_fracture.mp3', frame: 90, volume: 1.0, note: 'Glass stress fracture - pendulum shadow strikes the pane'},
  {file: 'servo_sand.mp3', frame: 150, volume: 0.9, note: 'Pneumatic servo slide + fine falling sand'},
  {file: 'whoosh_chime.mp3', frame: 330, volume: 0.9, note: 'Cinematic whoosh + 432Hz emerald crystal chime'},
  {file: 'lock_snap.mp3', frame: 510, volume: 1.0, note: 'Heavy metallic lock snap (+ plunge whoosh into the seal core)'},
];
