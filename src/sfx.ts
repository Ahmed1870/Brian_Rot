export type Cue = { file: string; at: number; vol: number; dur?: number };

const rows = (n: number, f: (i: number) => Cue): Cue[] => Array.from({ length: n }, (_, i) => f(i));

/** Sound-design cue sheet (seconds) — every cue is tied to a visual event of the scenes. */
export const SFX: Cue[] = [
  // Scene 1 — concurrency
  { file: "whoosh", at: 0.3, vol: 0.3 },
  ...[3.0, 5.0, 8.0, 11.0, 4.0, 6.5, 9.5, 12.0].map((at) => ({ file: "pop", at, vol: 0.2, dur: 0.3 })),
  { file: "buzz", at: 20.0, vol: 0.45, dur: 1.4 },
  { file: "success", at: 20.7, vol: 0.4, dur: 2 },
  { file: "pop", at: 25.9, vol: 0.25, dur: 0.3 },
  { file: "buzz", at: 31.1, vol: 0.3, dur: 1.2 },
  // Scene 2 — anomalies
  { file: "whoosh", at: 41.3, vol: 0.3 },
  ...[46.4, 57.7, 68.7].map((at) => ({ file: "snap", at, vol: 0.4 })),
  { file: "buzz", at: 50.6, vol: 0.4, dur: 1.2 },
  { file: "success", at: 54.8, vol: 0.45, dur: 2 },
  { file: "ding", at: 66.6, vol: 0.3 },
  { file: "ding", at: 78.2, vol: 0.3 },
  // Scene 3 — levels
  { file: "typing", at: 86.9, vol: 0.3, dur: 7 },
  { file: "ding", at: 96.3, vol: 0.35 },
  { file: "typing", at: 107.4, vol: 0.3, dur: 2.2 },
  { file: "ding", at: 108.2, vol: 0.4 },
  { file: "typing", at: 115.3, vol: 0.3, dur: 1.8 },
  { file: "success", at: 116.1, vol: 0.5, dur: 2 },
  { file: "whoosh", at: 121.1, vol: 0.3 },
  // Scene 4 — snapshot + SSI
  { file: "whoosh", at: 131.0, vol: 0.3 },
  { file: "snap", at: 147.0, vol: 0.55 },
  { file: "laser", at: 154.0, vol: 0.35, dur: 3 },
  { file: "buzz", at: 156.2, vol: 0.4, dur: 1.2 },
  { file: "thud", at: 158.8, vol: 0.5 },
  { file: "typing", at: 160.8, vol: 0.3, dur: 5.4 },
  // Scene 5 — audit report
  { file: "typing", at: 182.4, vol: 0.3, dur: 7.4 },
  { file: "pop", at: 189.9, vol: 0.3, dur: 0.3 },
  { file: "success", at: 190.3, vol: 0.35, dur: 2 },
  { file: "stamp", at: 196.2, vol: 0.6, dur: 2 },
  { file: "typing", at: 198.0, vol: 0.3, dur: 0.9 },
  // Scene 6 — academy outro
  { file: "success", at: 211.0, vol: 0.4, dur: 2 },
  ...[213.2, 214.4, 215.6, 216.7].map((at) => ({ file: "ding", at, vol: 0.25 })),
  { file: "success", at: 217.8, vol: 0.5, dur: 2 },
  { file: "pop", at: 221.2, vol: 0.3, dur: 0.3 },
  { file: "pop", at: 225.3, vol: 0.3, dur: 0.3 },
];
