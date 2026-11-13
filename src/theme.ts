import {loadFont as loadArabic} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadUI} from '@remotion/google-fonts/OpenSans';

const ar = loadArabic('normal', {weights: ['400', '600', '700'], subsets: ['arabic', 'latin']});
const mono = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']});
const ui = loadUI('normal', {weights: ['400', '600', '700'], subsets: ['latin']});

export const FONT = `${ar.fontFamily}, 'Segoe UI', Tahoma, sans-serif`;
export const MONO = `${mono.fontFamily}, Consolas, 'Courier New', monospace`;
export const UIFONT = `${ui.fontFamily}, 'Segoe UI', Arial, sans-serif`;
export const CELLFONT = `Carlito, Calibri, ${ui.fontFamily}, Arial, sans-serif`;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
export const TOTAL_FRAMES = 7200;
export const LESSON = 68;
export const TOTAL_LESSONS = 76;
export const UNIT = 13;
export const TOTAL_UNITS = 14;
export const COMP_ID = 'XL-L68-AdvCharts';
export const VOICE_FILE = 'voiceover_lesson_68.mp3';
export const LOGO_FILE = 'manzooma_logo.svg';

export const C = {
  bg: '#0F172A', card: '#1E293B', deep: '#0B1222', border: '#334155', muted: '#94A3B8',
  text: '#F8FAFC', blue: '#38BDF8', green: '#10B981', amber: '#F59E0B', red: '#EF4444',
  purple: '#A855F7', gold: '#FBBF24', cyan: '#06B6D4',
};

export const START = {s1: 0, s2: 40, s3: 85, s4: 130, s5: 170, s6: 210};
const fr = (s: number) => Math.round(s * FPS);
const starts = [START.s1, START.s2, START.s3, START.s4, START.s5, START.s6].map(fr);
const ends = [...starts.slice(1), TOTAL_FRAMES];
const mk = (i: number) => ({from: starts[i], dur: ends[i] - starts[i]});
export const SCENES = {s1: mk(0), s2: mk(1), s3: mk(2), s4: mk(3), s5: mk(4), s6: mk(5)};
