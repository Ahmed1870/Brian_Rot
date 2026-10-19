export type Stem = {file: string; frame: number; volume: number; note: string};
export const VOICE = {file: 'vo_average_trap.mp3', volume: 1};

/** Sound stems fired on exact frames (public/). */
export const STEMS: Stem[] = [
  {file: 'sub_bass.mp3', frame: 0, volume: 0.9, note: 'Sharp sub-bass hit - hook explosion'},
  {file: 'impact.mp3', frame: 120, volume: 1.0, note: 'Heavy billionaire block lands + rising whistle'},
  {file: 'servo_slide.mp3', frame: 336, volume: 0.9, note: 'Hydraulic screen split + soft error ping'},
  {file: 'emerald_chime.mp3', frame: 786, volume: 0.9, note: 'Emerald crystal chime - median reveal'},
  {file: 'metallic_lock.mp3', frame: 1098, volume: 0.9, note: 'Metallic lock - ecosystem hubs'},
  {file: 'ping.mp3', frame: 1476, volume: 0.8, note: 'Pulsing notification ping - contact + CTA'},
];
