import {clamp, hash} from './anim';

export type V4 = [number, number, number, number];
export type V3 = [number, number, number];
const TAU = Math.PI * 2;

export const VERTS: V4[] = Array.from({length: 16}, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1] as V4);
export const EDGES: [number, number][] = [];
for (let a = 0; a < 16; a++) for (let b = a + 1; b < 16; b++) {
  const x = a ^ b;
  if (x === 1 || x === 2 || x === 4 || x === 8) EDGES.push([a, b]);
}
/** 24 square 2-faces: choose 2 free axes, fix the other 2 to +-1. */
export const FACES: V4[][] = [];
for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
  const fixed = [0, 1, 2, 3].filter((k) => k !== a && k !== b);
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const mk = (u: number, v: number) => {
      const p: V4 = [0, 0, 0, 0];
      p[a] = u; p[b] = v; p[fixed[0]] = sx; p[fixed[1]] = sy;
      return p;
    };
    FACES.push([mk(-1, -1), mk(1, -1), mk(1, 1), mk(-1, 1)]);
  }
}

const rot = (p: V4, i: number, j: number, a: number): V4 => {
  const c = Math.cos(a), s = Math.sin(a);
  const q: V4 = [...p] as V4;
  q[i] = p[i] * c - p[j] * s;
  q[j] = p[i] * s + p[j] * c;
  return q;
};

/** All angles are integer multiples of 2*PI over the loop => frame 450 == frame 0. */
export const phi = (t: number) => t + 0.15 * Math.sin(TAU * t);

export const rot4 = (p: V4, t: number): V4 => {
  const ph = phi(t);
  let q = rot(p, 0, 3, TAU * ph);          // XW  (inside-out)
  q = rot(q, 2, 3, TAU * (2 * t) + 0.6);    // ZW
  q = rot(q, 1, 3, TAU * ph * 1 + 1.1);     // YW
  q = rot(q, 0, 1, TAU * t);                // XY
  return q;
};

const D = 4;
export const proj43 = (p: V4): V3 => {
  const s = D / (D - p[3]);
  return [p[0] * s, p[1] * s, p[2] * s];
};

const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Liquid mix: 0 = tesseract, 1 = liquid torus. Zero at both ends of the loop. */
export const mixAt = (t: number) => smooth(0.25, 0.42, t) * (1 - smooth(0.66, 0.88, t));

const easeOutBack = (x: number) => {
  const c1 = 1.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
/** Scale: collapses to a point at t~0.94, bursts back out through the wrap. Continuous across frame 450 -> 0. */
export const scaleAt = (t: number) => {
  const u = (t - 0.9 + 1) % 1; // u=0 at t=.90, u=.10 at the wrap
  if (u < 0.04) return 1 - 0.96 * smooth(0, 0.04, u);
  if (u < 0.13) return 0.04 + 0.96 * easeOutBack(clamp((u - 0.04) / 0.09));
  return 1;
};

export const STRANDS = 128;
export const SAMPLES = 26;

/** 3D position of strand j at parameter u, blended between tesseract edge and liquid torus. */
export const strandPoint = (j: number, u: number, t: number, m: number): V3 => {
  const e = EDGES[j % 32];
  const layer = Math.floor(j / 32);
  const a = VERTS[e[0]], b = VERTS[e[1]];
  const off = (layer - 1.5) * 0.07;
  const p4: V4 = [
    a[0] + (b[0] - a[0]) * u + off * (hash(j * 1.1) - 0.5) * 2,
    a[1] + (b[1] - a[1]) * u + off * (hash(j * 2.3) - 0.5) * 2,
    a[2] + (b[2] - a[2]) * u + off * (hash(j * 3.7) - 0.5) * 2,
    a[3] + (b[3] - a[3]) * u + off * (hash(j * 4.9) - 0.5) * 2,
  ];
  const A = proj43(rot4(p4, t));
  if (m <= 0.0005) return A;
  const tau = TAU * t;
  const g = j / STRANDS;
  const ang = TAU * (u * 1 + g);
  const b2 = TAU * (g * 3 + u * 2) + 2 * tau;
  const R = 1.15 + 0.3 * Math.sin(3 * ang + 3 * tau);
  const rr = 0.5 + 0.12 * Math.sin(2 * b2 - tau);
  const B: V3 = [
    (R + rr * Math.cos(b2)) * Math.cos(ang),
    (R + rr * Math.cos(b2)) * Math.sin(ang),
    0.85 * rr * 1.6 * Math.sin(b2) + 0.3 * Math.sin(2 * ang - 2 * tau),
  ];
  return [A[0] + (B[0] - A[0]) * m, A[1] + (B[1] - A[1]) * m, A[2] + (B[2] - A[2]) * m];
};

/** Camera: periodic yaw/pitch, then perspective to screen. */
export const toScreen = (p: V3, t: number, cx: number, cy: number, S: number, scale: number) => {
  const yaw = TAU * t + 0.4;
  const pitch = 0.42 * Math.sin(TAU * t) + 0.25;
  const x1 = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw);
  const z1 = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
  const y2 = p[1] * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = p[1] * Math.sin(pitch) + z1 * Math.cos(pitch);
  const f = 7;
  const k = f / Math.max(1.5, f + z2);
  return {x: cx + x1 * S * k * scale, y: cy + y2 * S * k * scale, z: z2, k};
};
