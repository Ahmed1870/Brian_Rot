export const FPS = 30;

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const mix = (a: number, b: number, p: number): number => a + (b - a) * p;
export const prog = (t: number, a: number, b: number): number =>
  b === a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a));

export type EaseFn = (x: number) => number;

// Cubic-bezier easing (same maths as CSS), implemented locally so animation never depends on library internals.
export function bezier(x1: number, y1: number, x2: number, y2: number): EaseFn {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (s: number) => ((ax * s + bx) * s + cx) * s;
  const sy = (s: number) => ((ay * s + by) * s + cy) * s;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let s = x;
    for (let i = 0; i < 28; i++) {
      const v = sx(s);
      if (Math.abs(v - x) < 1e-5) break;
      if (v < x) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }
    return sy(s);
  };
}

export const lin: EaseFn = (x) => x;
export const eo = bezier(0.16, 1, 0.3, 1);
export const eio = bezier(0.65, 0, 0.35, 1);
export const ei = bezier(0.7, 0, 0.84, 0);
export const back = bezier(0.34, 1.56, 0.64, 1);
export const soft = bezier(0.25, 0.1, 0.25, 1);

// progress of t between a and b, eased
export const seg = (t: number, a: number, b: number, e: EaseFn = eo): number => e(prog(t, a, b));
// map time window to value range
export const rng = (t: number, a: number, b: number, v0: number, v1: number, e: EaseFn = lin): number =>
  mix(v0, v1, e(prog(t, a, b)));

// deterministic pseudo random
export const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};
export const hash2 = (a: number, b: number): number => hash(a * 91.7 + b * 17.3 + 5.1);

export const fmt = (n: number): string => Math.round(n).toLocaleString('en-US');

export const typed = (text: string, t: number, start: number, dt: number): string => {
  const n = Math.floor((t - start) / dt);
  return n <= 0 ? '' : text.slice(0, Math.min(text.length, n));
};

// pulse 0..1..0 repeating
export const pulse = (t: number, period = 1): number => 0.5 - 0.5 * Math.cos((t / period) * Math.PI * 2);

// ---------- cursor path (cubic bezier segments between keyframes) ----------
export type CursorKey = { x: number; y: number; arrive: number; depart: number; click?: number[] };

export function cursorAt(keys: CursorKey[], t: number): { x: number; y: number; moving: boolean } {
  if (t <= keys[0].depart) return { x: keys[0].x, y: keys[0].y, moving: false };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t >= a.depart && t < b.arrive) {
      const p = eio(prog(t, a.depart, b.arrive));
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const curv = (hash(i + 3.3) - 0.5) * 0.5 * len;
      const p1x = a.x + dx * 0.28 + nx * curv;
      const p1y = a.y + dy * 0.28 + ny * curv;
      const p2x = a.x + dx * 0.72 + nx * curv * 0.45;
      const p2y = a.y + dy * 0.72 + ny * curv * 0.45;
      const u = 1 - p;
      const x = u * u * u * a.x + 3 * u * u * p * p1x + 3 * u * p * p * p2x + p * p * p * b.x;
      const y = u * u * u * a.y + 3 * u * u * p * p1y + 3 * u * p * p * p2y + p * p * p * b.y;
      return { x, y, moving: true };
    }
    if (t >= b.arrive && t < b.depart) return { x: b.x, y: b.y, moving: false };
  }
  const last = keys[keys.length - 1];
  return { x: last.x, y: last.y, moving: false };
}

export function allClicks(keys: CursorKey[]): number[] {
  const out: number[] = [];
  keys.forEach((k) => (k.click || []).forEach((c) => out.push(c)));
  return out;
}

// camera shake (deterministic)
export function shake(t: number, amp: number): { x: number; y: number; r: number } {
  const f = Math.floor(t * 30);
  return {
    x: (hash(f * 1.13) - 0.5) * 2 * amp,
    y: (hash(f * 2.71 + 9) - 0.5) * 2 * amp,
    r: (hash(f * 3.37 + 4) - 0.5) * amp * 0.06,
  };
}
