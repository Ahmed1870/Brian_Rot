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
export const LESSON = 51;
export const COMP_ID = 'SQL-L51-Sequential-Scan';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // index route
  green: '#10B981', // optimized / index scan
  amber: '#F59E0B', // warning
  red: '#EF4444', // seq scan / bottleneck
  purple: '#A855F7',
  bronze: '#CD7F32', 
};

// Scene boundaries sit on the real voiceover pauses (42.5 / 86.0 / 129.7 / 168.9 / 205.9 s) - the narration has no long silent gaps
export const SCENES = {
  s1: {from: 0, dur: 1275},
  s2: {from: 1275, dur: 1305},
  s3: {from: 2580, dur: 1310},
  s4: {from: 3890, dur: 1177},
  s5: {from: 5067, dur: 1110},
  s6: {from: 6177, dur: 1023},
};
// scene start in seconds (absolute) - scenes convert absolute voiceover seconds with t(g) = sec(g - S)
export const START = {s1: 0, s2: 42.5, s3: 86.0, s4: 129.67, s5: 168.9, s6: 205.9};
