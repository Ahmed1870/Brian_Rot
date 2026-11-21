import {interpolate, Easing} from 'remotion';

export const ease = Easing.bezier(0.4, 0, 0.2, 1);

/** 0 -> 1 starting at frame `at`, lasting `d` frames. */
export const pop = (f: number, at: number, d = 10): number =>
  interpolate(f, [at, at + d], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export type Pt = [number, number, number];

/** Cursor position from waypoints [frame, x, y]; eased between consecutive points. */
export const cursorAt = (f: number, pts: Pt[]): {x: number; y: number} => {
  if (f <= pts[0][0]) return {x: pts[0][1], y: pts[0][2]};
  for (let i = 1; i < pts.length; i++) {
    if (f <= pts[i][0]) {
      const a = pts[i - 1];
      const b = pts[i];
      const t = ease((f - a[0]) / Math.max(1, b[0] - a[0]));
      return {x: lerp(a[1], b[1], t), y: lerp(a[2], b[2], t)};
    }
  }
  const l = pts[pts.length - 1];
  return {x: l[1], y: l[2]};
};
