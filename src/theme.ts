export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const TOTAL = 7200; // 4:00

export const C = {
  bg: '#0F172A',
  panel: '#1E293B',
  line: '#334155',
  blue: '#38BDF8',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  text: '#F8FAFC',
  dim: '#94A3B8',
  pink: '#F472B6',
};

export const S = {
  s1: {from: 0, dur: 1200},
  s2: {from: 1200, dur: 1200},
  s3: {from: 2400, dur: 1350},
  s4: {from: 3750, dur: 1200},
  s5: {from: 4950, dur: 1350},
  s6: {from: 6300, dur: 900},
};

export type Cue = {frame: number; file: string; vol?: number};
export const CUES: Cue[] = [
  {frame: 540, file: 'alarm', vol: 0.5},
  {frame: 1350, file: 'tick', vol: 0.5},
  {frame: 1950, file: 'click', vol: 0.8},
  {frame: 1950, file: 'ping', vol: 0.6},
  {frame: 2700, file: 'shift', vol: 0.5},
  {frame: 3300, file: 'success', vol: 0.55},
  {frame: 3960, file: 'typing', vol: 0.6},
  {frame: 4560, file: 'pop', vol: 0.7},
  {frame: 5250, file: 'fail', vol: 0.5},
  {frame: 5850, file: 'rise', vol: 0.6},
  ...[S.s2, S.s3, S.s4, S.s5].map((s) => ({frame: s.from, file: 'slide', vol: 0.3})),
  // result "pop" cards in scene 4 (local 230/470/750/1010)
  ...[230, 470, 750, 1010].map((f) => ({frame: S.s4.from + f, file: 'pop', vol: 0.4})),
];
