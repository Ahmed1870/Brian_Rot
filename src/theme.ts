export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const TOTAL = 7200; // 4:00

export const C = {
  bg: '#0F172A', bg2: '#0B1220', panel: '#1E293B', panel2: '#172033', line: '#334155',
  blue: '#38BDF8', purple: '#A855F7', green: '#10B981', amber: '#F59E0B', red: '#EF4444',
  text: '#F8FAFC', dim: '#94A3B8', pink: '#F472B6', row: '#64748B',
};

export const S = {
  s1: {from: 0, dur: 1200},
  s2: {from: 1200, dur: 1350},
  s3: {from: 2550, dur: 1350},
  s4: {from: 3900, dur: 1200},
  s5: {from: 5100, dur: 1200},
  s6: {from: 6300, dur: 900},
};

// narration is a full 240 s timeline file -> starts at frame 0
export const VOICE_START = 0;

export type Cue = {frame: number; file: string; vol?: number};
export const CUES: Cue[] = [
  {frame: 540, file: 'click', vol: 0.8},
  {frame: 1350, file: 'typing', vol: 0.5},
  {frame: 2100, file: 'alert', vol: 0.5},
  {frame: 2700, file: 'whoosh', vol: 0.5},
  {frame: 3450, file: 'click', vol: 0.7},
  {frame: 3450, file: 'success', vol: 0.4},
  {frame: 4050, file: 'tick', vol: 0.6},
  {frame: 4650, file: 'click', vol: 0.7},
  {frame: 5250, file: 'typing', vol: 0.5},
  {frame: 5850, file: 'success', vol: 0.5},
  {frame: 5850, file: 'ping', vol: 0.5},
  ...[S.s2, S.s3, S.s4, S.s5].map((s) => ({frame: s.from, file: 'slide', vol: 0.3})),
];
