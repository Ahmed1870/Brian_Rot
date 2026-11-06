export type Cue = { file: string; at: number; vol: number; dur?: number };

const rows = (n: number, f: (i: number) => Cue): Cue[] => Array.from({ length: n }, (_, i) => f(i));

/** Sound-design cue sheet (seconds) — every cue is tied to a visual event of the scenes. */
export const SFX: Cue[] = [
  // Scene 1 — COALESCE
  { file: "whoosh", at: 0.3, vol: 0.3 },
  ...[14.9, 16.3, 17.5].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  { file: "typing", at: 25.0, vol: 0.3, dur: 5.0 },
  ...rows(5, (i) => ({ file: "blip", at: 27.0 + i * 1.15, vol: 0.28, dur: 0.3 })),
  { file: "success", at: 33.4, vol: 0.4, dur: 2 },
  { file: "ding", at: 42.8, vol: 0.3 },
  // Scene 2 — NULLIF
  { file: "typing", at: 46.1, vol: 0.3, dur: 3.2 },
  { file: "buzz", at: 50.5, vol: 0.55, dur: 1.4 },
  ...[55.4, 58.0].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  { file: "typing", at: 60.0, vol: 0.3, dur: 4.4 },
  { file: "ding", at: 66.9, vol: 0.4 },
  { file: "success", at: 71.2, vol: 0.5, dur: 2 },
  // Scene 3 — GREATEST / LEAST
  { file: "whoosh", at: 90.4, vol: 0.3 },
  { file: "pop", at: 95.0, vol: 0.25, dur: 0.3 },
  { file: "pop", at: 95.9, vol: 0.25, dur: 0.3 },
  { file: "whoosh", at: 100.2, vol: 0.3 },
  ...rows(3, (i) => ({ file: "snap", at: 105.8 + i * 1.2, vol: 0.4 })),
  ...rows(3, (i) => ({ file: "ding", at: 115.3 + i * 0.8, vol: 0.3 })),
  ...[120.5, 124.0, 129.6].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  // Scene 4 — short-circuit
  { file: "whoosh", at: 145.9, vol: 0.3 },
  { file: "success", at: 148.8, vol: 0.45, dur: 2 },
  ...[149.4, 149.7].map((at) => ({ file: "snap", at, vol: 0.5 })),
  { file: "hash", at: 156.5, vol: 0.4, dur: 4 },
  { file: "laser", at: 163.0, vol: 0.35, dur: 5 },
  // Scene 5 — protected report
  { file: "typing", at: 180.4, vol: 0.3, dur: 10.7 },
  ...[188.5, 194.3, 197.3].map((at) => ({ file: "ding", at, vol: 0.3 })),
  ...rows(4, (i) => ({ file: "click", at: 192.2 + i * 0.6, vol: 0.3, dur: 0.3 })),
  { file: "stamp", at: 204.0, vol: 0.6, dur: 2 },
  // Scene 6 — academy outro
  { file: "success", at: 218.2, vol: 0.4, dur: 2 },
  ...[219.8, 221.0, 221.8, 222.6].map((at) => ({ file: "ding", at, vol: 0.25 })),
  { file: "success", at: 224.6, vol: 0.5, dur: 2 },
  { file: "pop", at: 229.0, vol: 0.3, dur: 0.3 },
  { file: "pop", at: 232.5, vol: 0.3, dur: 0.3 },
];
