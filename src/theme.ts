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
export const LESSON = 22;
export const COMP_ID = 'SQL-L22-Set-Subqueries';

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
  red: '#EF4444', // NOT IN NULL trap
};

// Scene boundaries sit in the REAL silence gaps of the voiceover (gaps at 38.9-41.1 / 83.8-86.1 / 128.9-131.1 / 168.8-171.1 / 207.9-210.1)
export const SCENES = {
  s1: {from: 0, dur: 1200},
  s2: {from: 1200, dur: 1350},
  s3: {from: 2550, dur: 1350},
  s4: {from: 3900, dur: 1200},
  s5: {from: 5100, dur: 1170},
  s6: {from: 6270, dur: 930},
};
// scene start in seconds (absolute) - scenes convert absolute voiceover seconds with t(g) = sec(g - S)
export const START = {s1: 0, s2: 40, s3: 85, s4: 130, s5: 170, s6: 209};
