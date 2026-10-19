import {spring, SpringConfig} from 'remotion';

/** spring() comes from the core `remotion` package (there is no separate @remotion/spring). */
export const SPRINGS: Record<'main' | 'snap' | 'text' | 'heavy' | 'soft', SpringConfig> = {
  main: {mass: 0.7, stiffness: 110, damping: 16, overshootClamping: false},
  snap: {mass: 0.6, stiffness: 240, damping: 11, overshootClamping: false},
  text: {mass: 0.8, stiffness: 140, damping: 13, overshootClamping: false},
  heavy: {mass: 1.6, stiffness: 120, damping: 9, overshootClamping: false},
  soft: {mass: 1, stiffness: 90, damping: 22, overshootClamping: false},
};
export const sp = (f: number, cfg: SpringConfig, delay = 0) => spring({frame: Math.max(0, f - delay), fps: 30, config: cfg});
