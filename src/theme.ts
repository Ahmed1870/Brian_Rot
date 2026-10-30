import {loadFont} from '@remotion/google-fonts/IBMPlexSansArabic';

const {fontFamily} = loadFont('normal', {
  weights: ['400', '600', '700'],
  subsets: ['arabic', 'latin'],
});

export const FONT = `${fontFamily}, 'Segoe UI', Tahoma, sans-serif`;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const TOTAL_FRAMES = 6300; // 210s * 30fps

// Corporate dark mode: no neon, slate accents, crimson only for operational-gap indicators
export const C = {
  bg: '#0D0D0D',
  panel: '#14171C',
  line: '#262B33',
  white: '#F8FAFC',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  crimson: '#DC1F45',
};

// Frame ranges (exact spec)
export const SCENES = {
  s1: {from: 0, dur: 900},
  s2: {from: 900, dur: 1350},
  s3: {from: 2250, dur: 1350},
  s4: {from: 3600, dur: 1350},
  s5: {from: 4950, dur: 900},
  s6: {from: 5850, dur: 450},
};
