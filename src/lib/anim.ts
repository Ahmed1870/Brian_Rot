import {Easing, interpolate, spring, SpringConfig} from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ramp = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const SP: Record<string, SpringConfig> = {
  pop: {stiffness: 170, damping: 10, mass: 0.8, overshootClamping: false},
  bouncy: {stiffness: 110, damping: 8, mass: 1, overshootClamping: false},
  soft: {stiffness: 90, damping: 20, mass: 1, overshootClamping: false},
  snap: {stiffness: 300, damping: 15, mass: 0.6, overshootClamping: false},
  text: {stiffness: 150, damping: 9, mass: 0.8, overshootClamping: false},
};

export const sp = (f: number, cfg: SpringConfig, delay = 0) =>
  spring({frame: Math.max(0, f - delay), fps: 30, config: cfg});

export const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Keyframed value with eased segments. frames must be strictly increasing. */
export const kf = (f: number, frames: number[], vals: number[]) =>
  interpolate(f, frames, vals, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });

/** Smooth cubic path through points (Catmull-Rom -> Bezier). */
export const smoothPath = (p: {x: number; y: number}[]) => {
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[Math.min(p.length - 1, i + 2)];
    const c1 = {x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6};
    const c2 = {x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6};
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
};
