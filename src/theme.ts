import {loadFont as loadArabic} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const ar = loadArabic('normal', {weights: ['400', '600', '700'], subsets: ['arabic', 'latin']});
const mono = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']});

export const FONT = `${ar.fontFamily}, 'Segoe UI', Tahoma, sans-serif`;
export const MONO = `${mono.fontFamily}, Consolas, 'Courier New', monospace`;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const TOTAL_FRAMES = 7200; // 240s * 30fps

// Manzooma course palette
export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // pgAdmin GUI / Query Tool
  green: '#10B981', // PostgreSQL service / verified
  amber: '#F59E0B', // superuser / security lock / packets
  red: '#EF4444', // connection refused
};

// Scene boundaries follow the REAL voiceover (silence gaps at 41.0s / 79.7s / 124.8s / 164.3s / 202.3s)
export const SCENES = {
  s1: {from: 0, dur: 1230},
  s2: {from: 1230, dur: 1160},
  s3: {from: 2390, dur: 1355},
  s4: {from: 3745, dur: 1185},
  s5: {from: 4930, dur: 1140},
  s6: {from: 6070, dur: 1130},
};
