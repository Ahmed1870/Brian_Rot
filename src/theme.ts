export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const TOTAL = 6750; // 3:45 exactly

export const C = {
  bg: '#0D0D0D',
  grid: '#1E2530',
  slate: '#64748B',
  white: '#FFFFFF',
  red: '#DC143C',
  green: '#10B981',
  dim: '#9AA4B2',
};

export const S = {
  s1: {from: 0, dur: 1050},
  s2: {from: 1050, dur: 1500},
  s3: {from: 2550, dur: 1500},
  s4: {from: 4050, dur: 1200},
  s5: {from: 5250, dur: 1050},
  s6: {from: 6300, dur: 450},
};

// local-frame cues shared by visuals + SFX
export const S1_LEAVE = 560; // manager walks away
export const S1_FALL = 650; // arrows drop
export const S2_ROWA = 60;
export const S2_ROWB = 640;
export const S3_FIX = 500; // loop turns green
export const S4_UNLOCK = 720;
export const S5_CARDS = [60, 360, 660];

export type Cue = {frame: number; file: string; vol?: number};
const A = (s: {from: number}, f: number) => s.from + f;

export const CUES: Cue[] = [
  {frame: 0, file: 'bass_drop', vol: 1},
  {frame: A(S.s1, S1_FALL), file: 'alarm', vol: 0.55},
  ...[S.s2, S.s3, S.s4, S.s5, S.s6].map((s) => ({frame: s.from, file: 'slide', vol: 0.6})),
  {frame: A(S.s2, S2_ROWA + 380), file: 'alert', vol: 0.8},
  {frame: A(S.s2, S2_ROWA + 470), file: 'alert', vol: 0.8},
  {frame: A(S.s2, S2_ROWB + 330), file: 'ping', vol: 0.8},
  {frame: A(S.s2, 1100), file: 'click', vol: 0.7},
  {frame: A(S.s2, 1250), file: 'alert', vol: 0.5},
  {frame: A(S.s3, 60), file: 'click', vol: 0.7},
  {frame: A(S.s3, 140), file: 'click', vol: 0.7},
  {frame: A(S.s3, 220), file: 'click', vol: 0.7},
  {frame: A(S.s3, 340), file: 'alert', vol: 0.7},
  {frame: A(S.s3, S3_FIX), file: 'success', vol: 0.7},
  {frame: A(S.s4, 380), file: 'alarm', vol: 0.4},
  {frame: A(S.s4, S4_UNLOCK), file: 'unlock', vol: 0.9},
  ...S5_CARDS.map((f) => ({frame: A(S.s5, f), file: 'typing', vol: 0.7})),
  {frame: A(S.s6, 0), file: 'outro_sting', vol: 0.9},
];
