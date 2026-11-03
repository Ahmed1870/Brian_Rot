export type Cue = { file: string; at: number; vol: number; dur?: number };

const rows = (n: number, f: (i: number) => Cue): Cue[] => Array.from({ length: n }, (_, i) => f(i));

/** Sound-design cue sheet (seconds) — every cue is tied to a visual event of the scenes. */
export const SFX: Cue[] = [
  // Scene 1 — bucketing
  { file: "whoosh", at: 0.3, vol: 0.3 },
  { file: "ding", at: 12.4, vol: 0.28 },
  { file: "snap", at: 20.66, vol: 0.5 },
  { file: "whoosh", at: 20.9, vol: 0.35 },
  ...rows(12, (i) => ({ file: "click", at: 23.4 + i * 0.44 + 0.72, vol: 0.4, dur: 0.3 })),
  { file: "whoosh", at: 31.95, vol: 0.3 },
  { file: "thud", at: 33.0, vol: 0.55 },
  ...rows(3, (i) => ({ file: "ding", at: 35.6 + i * 0.45, vol: 0.35 })),
  // Scene 2 — pipeline
  ...rows(7, (i) => ({ file: "pop", at: 42.6 + i * 0.5, vol: 0.22, dur: 0.3 })),
  { file: "whoosh", at: 49.6, vol: 0.45 },
  ...[51.3, 55.2, 61.4, 66.0, 72.4, 75.3, 77.9].map((at) => ({ file: "blip", at, vol: 0.3, dur: 0.3 })),
  { file: "snap", at: 55.2, vol: 0.55 },
  { file: "snap", at: 66.0, vol: 0.55 },
  // Scene 3 — WHERE vs HAVING
  { file: "thud", at: 89.4, vol: 0.45 },
  { file: "typing", at: 97.5, vol: 0.32, dur: 6.0 },
  { file: "buzz", at: 104.3, vol: 0.55, dur: 1.4 },
  { file: "typing", at: 126.6, vol: 0.32, dur: 3.3 },
  { file: "success", at: 129.9, vol: 0.5, dur: 2 },
  // Scene 4 — hash vs group aggregate
  { file: "hash", at: 140.4, vol: 0.5, dur: 9 },
  { file: "laser", at: 153.5, vol: 0.4, dur: 5 },
  { file: "ding", at: 164.0, vol: 0.4 },
  // Scene 5 — enterprise analytics
  { file: "typing", at: 176.0, vol: 0.3, dur: 6.2 },
  { file: "typing", at: 183.3, vol: 0.3, dur: 3.3 },
  { file: "typing", at: 197.6, vol: 0.3, dur: 4.6 },
  { file: "snap", at: 200.5, vol: 0.4 },
  { file: "stamp", at: 205.6, vol: 0.6, dur: 2 },
  ...rows(3, (i) => ({ file: "ding", at: 208.7 + i * 0.3, vol: 0.3 })),
  // Scene 6 — academy outro
  { file: "success", at: 216.7, vol: 0.4, dur: 2 },
  ...rows(14, (i) => ({ file: "blip", at: 217.4 + i * 0.5, vol: 0.14, dur: 0.3 })),
  { file: "success", at: 224.6, vol: 0.5, dur: 2 },
  { file: "pop", at: 229.4, vol: 0.3, dur: 0.3 },
  { file: "pop", at: 233.5, vol: 0.3, dur: 0.3 },
];
