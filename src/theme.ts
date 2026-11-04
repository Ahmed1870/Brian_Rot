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
export const LESSON = 25;
export const COMP_ID = 'SQL-L25-String-Functions';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // IN set / hash table
  green: '#10B981', // match / safe / > ANY
  amber: '#F59E0B', // > ALL / cohort
  red: '#EF4444', // NULL crash / invalid
  purple: '#A855F7', // character index ruler
};

// Scene boundaries sit in the real voiceover pauses (42.7-43.5 / 80.6-89.3 / 131.8-132.7 / 169.6-178.4 / ~211.5)
export const SCENES = {
  s1: {from: 0, dur: 1290},
  s2: {from: 1290, dur: 1260},
  s3: {from: 2550, dur: 1410},
  s4: {from: 3960, dur: 1260},
  s5: {from: 5220, dur: 1125},
  s6: {from: 6345, dur: 855},
};
// scene start in seconds (absolute) - scenes convert absolute voiceover seconds with t(g) = sec(g - S)
export const START = {s1: 0, s2: 43, s3: 85, s4: 132, s5: 174, s6: 211.5};
