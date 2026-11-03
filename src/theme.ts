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
export const COMP_ID = 'SQL-L15-Conditional-Aggregation';

// Manzooma course palette (same family as the earlier lessons)
export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // single-pass scanner / FILTER gate
  green: '#10B981', // completed / SUM / verified
  amber: '#F59E0B', // returned / pivot columns
  red: '#EF4444', // cancelled / traps / slow path
};

// Scene boundaries sit in the REAL silence gaps of the voiceover (3.5s gaps at 38.7-42.2 / 84.7-88.3 / 130.7-134.3 / 171.5-175.1 / 211.6-215.2)
export const SCENES = {
  s1: {from: 0, dur: 1215},
  s2: {from: 1215, dur: 1380},
  s3: {from: 2595, dur: 1380},
  s4: {from: 3975, dur: 1225},
  s5: {from: 5200, dur: 1202},
  s6: {from: 6402, dur: 798},
};

// scene start in seconds (absolute) - scenes convert absolute voiceover seconds with t(g) = sec(g - S)
export const START = {s1: 0, s2: 40.5, s3: 86.5, s4: 132.5, s5: 173.33, s6: 213.4};
