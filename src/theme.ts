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
export const LESSON = 45;
export const COMP_ID = 'SQL-L45-Materialized-Views';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // physical MatView block / work_mem diff engine
  green: '#10B981', // physical storage / non-blocking refresh / high-speed benchmark / seal
  amber: '#F59E0B', // pg_class catalog node
  red: '#EF4444', // AccessExclusiveLock / pre-indexing benchmark
  purple: '#A855F7', // UNIQUE Index requirement shield
};

export const SCENES = {
  s1: {from: 0, dur: 1200},
  s2: {from: 1200, dur: 1350},
  s3: {from: 2550, dur: 1350},
  s4: {from: 3900, dur: 1200},
  s5: {from: 5100, dur: 1200},
  s6: {from: 6300, dur: 900},
};

export const START = {s1: 0, s2: 40, s3: 85, s4: 130, s5: 170, s6: 210};
