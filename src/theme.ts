import {loadFont as loadArabic} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadUI} from '@remotion/google-fonts/OpenSans';

const ar = loadArabic('normal', {weights: ['400', '600', '700'], subsets: ['arabic', 'latin']});
const mono = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']});
const ui = loadUI('normal', {weights: ['400', '600', '700'], subsets: ['latin']});

export const FONT = `${ar.fontFamily}, 'Segoe UI', Tahoma, sans-serif`;
export const MONO = `${mono.fontFamily}, Consolas, 'Courier New', monospace`;
// Excel chrome font (Segoe UI substitute: Open Sans) and cell font (Calibri substitute: Carlito, loaded from src/fonts)
export const UIFONT = `${ui.fontFamily}, 'Segoe UI', Arial, sans-serif`;
export const CELLFONT = `Carlito, Calibri, ${ui.fontFamily}, Arial, sans-serif`;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const TOTAL_FRAMES = 7200;
export const LESSON = 22;
export const COMP_ID = 'XL-L22-Data-Validation-Engine';
export const VOICE_FILE = 'voiceover_lesson_22.mp3';
export const LOGO_FILE = 'manzooma_logo.svg';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#A855F7',
  gold: '#FBBF24',
};

// Scene starts (absolute seconds) = middle of the real 2.5s silence gaps of the mp3
export const START = {s1: 0, s2: 39.88, s3: 84.92, s4: 129.9, s5: 169.99, s6: 208.99};
const fr = (s: number) => Math.round(s * FPS);
const starts = [START.s1, START.s2, START.s3, START.s4, START.s5, START.s6].map(fr);
const ends = [...starts.slice(1), TOTAL_FRAMES];
const mk = (i: number) => ({from: starts[i], dur: ends[i] - starts[i]});
export const SCENES = {s1: mk(0), s2: mk(1), s3: mk(2), s4: mk(3), s5: mk(4), s6: mk(5)};
