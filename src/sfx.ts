export type Cue = { file: string; at: number; vol: number; dur?: number };

const rows = (n: number, f: (i: number) => Cue): Cue[] => Array.from({ length: n }, (_, i) => f(i));

/** Sound-design cue sheet (seconds) — every cue is tied to a visual event of the scenes. */
export const SFX: Cue[] = [
  // Scene 1 — derived table + alias
  { file: "whoosh", at: 0.3, vol: 0.3 },
  ...[8.7, 9.9, 14.6].map((at) => ({ file: "pop", at, vol: 0.25, dur: 0.3 })),
  { file: "typing", at: 15.8, vol: 0.3, dur: 7.2 },
  { file: "snap", at: 19.0, vol: 0.4 },
  { file: "success", at: 20.5, vol: 0.4, dur: 2 },
  { file: "buzz", at: 24.8, vol: 0.3, dur: 1.2 },
  { file: "typing", at: 33.9, vol: 0.3, dur: 1.6 },
  { file: "snap", at: 34.8, vol: 0.55 },
  // Scene 2 — AVG(SUM) error and 2-step fix
  ...rows(4, (i) => ({ file: "pop", at: 46.0 + i * 0.45, vol: 0.22, dur: 0.3 })),
  { file: "whoosh", at: 50.8, vol: 0.3 },
  { file: "typing", at: 55.2, vol: 0.3, dur: 4.4 },
  { file: "buzz", at: 59.6, vol: 0.55, dur: 1.4 },
  { file: "typing", at: 64.0, vol: 0.3, dur: 9 },
  { file: "ding", at: 68.6, vol: 0.35 },
  { file: "ding", at: 74.7, vol: 0.35 },
  { file: "success", at: 78.0, vol: 0.5, dur: 2 },
  // Scene 3 — execution order + scope
  { file: "blip", at: 94.2, vol: 0.3, dur: 0.3 },
  { file: "thud", at: 100.1, vol: 0.45 },
  { file: "blip", at: 105.3, vol: 0.3, dur: 0.3 },
  { file: "snap", at: 106.6, vol: 0.45 },
  { file: "blip", at: 116.3, vol: 0.3, dur: 0.3 },
  ...[119.5, 122.0, 123.9].map((at) => ({ file: "buzz", at: at + 0.9, vol: 0.35, dur: 0.8 })),
  { file: "success", at: 125.7, vol: 0.5, dur: 2 },
  // Scene 4 — scan vs flattening
  { file: "pop", at: 138.6, vol: 0.25, dur: 0.3 },
  ...rows(4, (i) => ({ file: "click", at: 142.6 + i * 0.5, vol: 0.35, dur: 0.3 })),
  { file: "whoosh", at: 152.7, vol: 0.4 },
  { file: "laser", at: 154.0, vol: 0.35, dur: 3.5 },
  { file: "success", at: 157.6, vol: 0.5, dur: 2 },
  { file: "ding", at: 166.7, vol: 0.4 },
  // Scene 5 — branch contribution
  { file: "typing", at: 180.4, vol: 0.3, dur: 15.2 },
  { file: "snap", at: 188.4, vol: 0.35 },
  { file: "snap", at: 191.2, vol: 0.35 },
  { file: "whoosh", at: 196.6, vol: 0.35 },
  ...rows(4, (i) => ({ file: "click", at: 197.6 + i * 0.5, vol: 0.3, dur: 0.3 })),
  { file: "stamp", at: 207.5, vol: 0.6, dur: 2 },
  // Scene 6 — academy outro
  { file: "success", at: 215.9, vol: 0.4, dur: 2 },
  ...[217.4, 218.5, 219.5, 220.5].map((at) => ({ file: "ding", at, vol: 0.25 })),
  { file: "success", at: 221.4, vol: 0.5, dur: 2 },
  { file: "pop", at: 227.0, vol: 0.3, dur: 0.3 },
  { file: "pop", at: 231.4, vol: 0.3, dur: 0.3 },
];
