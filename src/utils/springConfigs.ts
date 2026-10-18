import {spring, SpringConfig} from 'remotion';

/** Spring presets (spring() lives in the core `remotion` package; there is no separate @remotion/spring). */
export const SPRINGS: Record<'camera' | 'snap' | 'text' | 'heavy' | 'plunge', SpringConfig> = {
  camera: {mass: 1.4, stiffness: 60, damping: 20, overshootClamping: false},
  heavy: {mass: 2.2, stiffness: 55, damping: 16, overshootClamping: false},
  snap: {mass: 0.7, stiffness: 240, damping: 11, overshootClamping: false},
  text: {mass: 0.8, stiffness: 140, damping: 13, overshootClamping: false},
  plunge: {mass: 0.5, stiffness: 120, damping: 14, overshootClamping: false},
};

export const sp = (f: number, cfg: SpringConfig, delay = 0, dur?: number) =>
  spring({frame: Math.max(0, f - delay), fps: 30, config: cfg, durationInFrames: dur});
