import { interpolate, Easing } from 'remotion';

const CL = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** eased 0..1 progress starting at `at` (seconds) lasting `dur` */
export const p = (t: number, at: number, dur = 0.6): number =>
  interpolate(t, [at, at + dur], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });

/** linear 0..1 progress */
export const lin = (t: number, at: number, dur = 1): number =>
  interpolate(t, [at, at + dur], [0, 1], CL);

/** fade in at `a`, fade out ending at `b` */
export const win = (t: number, a: number, b: number, f = 0.5): number =>
  lin(t, a, f) * (1 - lin(t, b - f, f));

/** 0 -> 1 -> 0 bump lasting `dur` after `at` */
export const bump = (t: number, at: number, dur = 0.6): number =>
  Math.sin(lin(t, at, dur) * Math.PI);

/** multi-keyframe interpolation, clamped */
export const keys = (t: number, ts: number[], vs: number[]): number =>
  interpolate(t, ts, vs, CL);

/** typed prefix of a string */
export const typed = (s: string, t: number, at: number, dur: number): string =>
  s.slice(0, Math.floor(lin(t, at, dur) * s.length));
