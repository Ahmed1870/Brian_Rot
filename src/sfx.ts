export type Cue = { file: string; at: number; vol: number; dur?: number };

const rows = (n: number, f: (i: number) => Cue): Cue[] => Array.from({ length: n }, (_, i) => f(i));

/** Sound-design cue sheet (seconds) — every cue is tied to a visual event of the scenes. */
export const SFX: Cue[] = [
  // Scene 1 — non-equi range matching
  { file: "whoosh", at: 0.3, vol: 0.3 },
  { file: "typing", at: 6.0, vol: 0.3, dur: 3.2 },
  { file: "buzz", at: 13.9, vol: 0.35, dur: 1.2 },
  { file: "whoosh", at: 16.0, vol: 0.3 },
  { file: "snap", at: 24.9, vol: 0.5 },
  { file: "typing", at: 31.6, vol: 0.3, dur: 4.7 },
  ...rows(6, (i) => ({ file: "click", at: 35.9 + i * 0.62 + 0.8, vol: 0.4, dur: 0.3 })),
  { file: "success", at: 36.7, vol: 0.4, dur: 2 },
  // Scene 2 — composite ON + on-the-fly
  { file: "typing", at: 43.0, vol: 0.3, dur: 10 },
  { file: "snap", at: 53.0, vol: 0.45 },
  ...[0, 2, 4, 6].map((i) => ({ file: "click", at: 54.0 + i * 1.1 + 3.0, vol: 0.35, dur: 0.3 })),
  ...[1, 3, 5, 7].map((i) => ({ file: "blip", at: 54.0 + i * 1.1 + 1.1, vol: 0.25, dur: 0.3 })),
  { file: "whoosh", at: 67.9, vol: 0.35 },
  { file: "ding", at: 80.7, vol: 0.4 },
  { file: "success", at: 83.0, vol: 0.4, dur: 2 },
  // Scene 3 — join tree
  ...[93.1, 93.9, 94.6, 96.0, 96.8, 97.5].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  { file: "buzz", at: 99.3, vol: 0.3, dur: 1.2 },
  ...[109.3, 111.0, 112.6, 114.2, 115.4].map((at) => ({ file: "blip", at, vol: 0.3, dur: 0.3 })),
  { file: "laser", at: 119.5, vol: 0.35, dur: 3 },
  { file: "success", at: 121.9, vol: 0.5, dur: 2 },
  // Scene 4 — LEFT/INNER trap
  { file: "typing", at: 133.0, vol: 0.3, dur: 7.8 },
  { file: "thud", at: 149.2, vol: 0.6 },
  { file: "buzz", at: 149.2, vol: 0.45, dur: 1.4 },
  { file: "success", at: 160.6, vol: 0.5, dur: 2 },
  { file: "whoosh", at: 162.2, vol: 0.3 },
  // Scene 5 — enterprise pipeline
  { file: "typing", at: 180.2, vol: 0.3, dur: 9.2 },
  ...[181.9, 182.5, 183.6, 184.8, 186.2].map((at) => ({ file: "blip", at, vol: 0.28, dur: 0.3 })),
  { file: "laser", at: 189.3, vol: 0.4, dur: 5 },
  ...rows(4, (i) => ({ file: "click", at: 195.4 + i * 0.45, vol: 0.3, dur: 0.3 })),
  { file: "ding", at: 198.4, vol: 0.4 },
  { file: "stamp", at: 205.6, vol: 0.6, dur: 2 },
  // Scene 6 — academy outro
  { file: "success", at: 213.0, vol: 0.4, dur: 2 },
  ...[216.4, 217.5, 218.5, 219.3].map((at) => ({ file: "ding", at, vol: 0.25 })),
  { file: "success", at: 220.2, vol: 0.5, dur: 2 },
  { file: "pop", at: 225.0, vol: 0.3, dur: 0.3 },
  { file: "pop", at: 229.4, vol: 0.3, dur: 0.3 },
];
