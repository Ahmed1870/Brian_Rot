export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const prog = (t: number, a: number, b: number) => (b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a)));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
export const easeInOut = (x: number) => {
  const c = clamp(x);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Number of characters of `text` visible at time t (human-like uneven rhythm, deterministic). */
export const typedCount = (text: string, t0: number, dur: number, t: number): number => {
  const n = text.length;
  if (n === 0 || t <= t0) return 0;
  if (t >= t0 + dur) return n;
  let total = 0;
  const w: number[] = [];
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    const x = 0.65 + hash(i * 3.7 + n) * 0.9 + (ch === ' ' || ch === '(' || ch === '=' ? 0.5 : 0) + (ch === '\n' ? 1.2 : 0);
    w.push(x);
    total += x;
  }
  const target = ((t - t0) / dur) * total;
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += w[i];
    if (acc > target) return i;
  }
  return n;
};

export const fade = (t: number, t0: number, d = 0.35) => easeOut(prog(t, t0, t0 + d));
