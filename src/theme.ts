export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const TOTAL = 8100; // 4:30 exactly

export const C = {
  bg: '#0D0D0D',
  grid: '#1E2530',
  slate: '#64748B',
  white: '#FFFFFF',
  red: '#DC143C',
  green: '#10B981',
  dim: '#9AA4B2',
};

// Scene boundaries (absolute frames)
export const S = {
  s1: {from: 0, dur: 1350},
  s2: {from: 1350, dur: 1800},
  s3: {from: 3150, dur: 1800},
  s4: {from: 4950, dur: 1350},
  s5: {from: 6300, dur: 1350},
  s6: {from: 7650, dur: 450},
};

// Local-frame cues shared between visuals and SFX
export const S2_REVEAL = [60, 220, 380, 540, 700, 860]; // price, materials, shipping, payment, ads, margin
export const S2_SURGE = 1050; // ads rise 400 -> 550
export const S2_LOSS = 1400; // "-50,000" kinetic text
export const S3_BALANCE = 1100; // breakeven reached
export const S4_NODE0 = 150;
export const S4_STEP = 130;
export const S5_CARDS = [60, 400, 740];

export type Cue = {frame: number; file: string; vol?: number};

const A = (s: {from: number}, f: number) => s.from + f;

export const CUES: Cue[] = [
  {frame: 0, file: 'bass_drop', vol: 1},
  {frame: 480, file: 'alarm', vol: 0.5},
  {frame: 900, file: 'alarm', vol: 0.4},
  ...[S.s2, S.s3, S.s4, S.s5, S.s6].map((s) => ({frame: s.from, file: 'slide', vol: 0.6})),
  ...S2_REVEAL.map((f) => ({frame: A(S.s2, f), file: 'click', vol: 0.8})),
  {frame: A(S.s2, S2_SURGE), file: 'alarm', vol: 0.6},
  {frame: A(S.s2, S2_LOSS), file: 'bass_drop', vol: 0.8},
  {frame: A(S.s3, 120), file: 'click', vol: 0.7},
  {frame: A(S.s3, S3_BALANCE), file: 'ping', vol: 0.9},
  {frame: A(S.s3, S3_BALANCE + 20), file: 'success', vol: 0.5},
  ...Array.from({length: 7}, (_, i) => ({
    frame: A(S.s4, S4_NODE0 + i * S4_STEP),
    file: i === 5 ? 'ping' : 'click',
    vol: 0.7,
  })),
  ...S5_CARDS.map((f) => ({frame: A(S.s5, f), file: 'typing', vol: 0.7})),
  {frame: A(S.s6, 0), file: 'outro_sting', vol: 0.9},
];
