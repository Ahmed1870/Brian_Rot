import {spring, SpringConfig} from 'remotion';

/** Tight, elastic tactile springs (spring() comes from the core `remotion` package). */
export const SPRINGS: Record<'main' | 'snap' | 'text' | 'soft', SpringConfig> = {
  main: {mass: 0.5, stiffness: 140, damping: 14, overshootClamping: false},
  snap: {mass: 0.45, stiffness: 220, damping: 12, overshootClamping: false},
  text: {mass: 0.6, stiffness: 150, damping: 13, overshootClamping: false},
  soft: {mass: 1, stiffness: 90, damping: 22, overshootClamping: false},
};
export const sp = (f: number, cfg: SpringConfig, delay = 0) => spring({frame: Math.max(0, f - delay), fps: 30, config: cfg});
