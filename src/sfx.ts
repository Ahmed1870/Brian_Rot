export type Cue = { file: string; at: number; vol: number; dur?: number };

const rows = (n: number, f: (i: number) => Cue): Cue[] => Array.from({ length: n }, (_, i) => f(i));

/** Sound-design cue sheet (seconds) — every cue is tied to a visual event of the scenes. */
export const SFX: Cue[] = [
  // Scene 1 — messy subqueries → WITH
  { file: "whoosh", at: 0.3, vol: 0.3 },
  { file: "typing", at: 6.6, vol: 0.3, dur: 8.4 },
  { file: "buzz", at: 21.0, vol: 0.35, dur: 1.2 },
  { file: "thud", at: 24.9, vol: 0.55 },
  ...[26.0, 26.6, 27.2].map((at) => ({ file: "snap", at, vol: 0.4 })),
  ...[31.6, 35.4, 36.8].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  // Scene 2 — IN / EXISTS
  { file: "typing", at: 42.5, vol: 0.3, dur: 3 },
  { file: "typing", at: 49.6, vol: 0.3, dur: 2.9 },
  { file: "success", at: 52.8, vol: 0.35, dur: 2 },
  { file: "typing", at: 56.0, vol: 0.3, dur: 1.3 },
  { file: "buzz", at: 61.2, vol: 0.55, dur: 1.4 },
  { file: "typing", at: 64.8, vol: 0.3, dur: 3.6 },
  ...rows(5, (i) => ({ file: "blip", at: 68.8 + i * 1.4, vol: 0.25, dur: 0.3 })),
  { file: "success", at: 76.0, vol: 0.45, dur: 2 },
  { file: "ding", at: 79.2, vol: 0.35 },
  { file: "ding", at: 80.1, vol: 0.35 },
  // Scene 3 — chained CTEs
  { file: "typing", at: 94.0, vol: 0.3, dur: 13.6 },
  ...[95.5, 100.5, 105.5].map((at) => ({ file: "snap", at, vol: 0.4 })),
  { file: "laser", at: 107.6, vol: 0.35, dur: 3 },
  ...[113.3, 118.0, 127.2].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  // Scene 4 — inlining / buffer
  { file: "whoosh", at: 139.8, vol: 0.3 },
  { file: "whoosh", at: 150.7, vol: 0.4 },
  { file: "success", at: 154.4, vol: 0.45, dur: 2 },
  { file: "ding", at: 155.9, vol: 0.35 },
  { file: "hash", at: 163.4, vol: 0.4, dur: 4 },
  { file: "ding", at: 164.7, vol: 0.35 },
  // Scene 5 — enterprise cohort
  { file: "typing", at: 181.4, vol: 0.3, dur: 11.7 },
  ...rows(5, (i) => ({ file: "click", at: 186.4 + i * 0.4, vol: 0.3, dur: 0.3 })),
  { file: "snap", at: 189.8, vol: 0.45 },
  { file: "stamp", at: 204.2, vol: 0.6, dur: 2 },
  // Scene 6 — academy outro
  { file: "success", at: 210.7, vol: 0.4, dur: 2 },
  ...[213.0, 214.2, 215.8, 216.9].map((at) => ({ file: "ding", at, vol: 0.25 })),
  { file: "success", at: 217.2, vol: 0.5, dur: 2 },
  { file: "pop", at: 222.4, vol: 0.3, dur: 0.3 },
  { file: "pop", at: 227.1, vol: 0.3, dur: 0.3 },
];
