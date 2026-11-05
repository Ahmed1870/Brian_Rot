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
export const LESSON = 41;
export const COMP_ID = 'SQL-L41-NTile-Percentiles';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // PERCENT_RANK scale / WindowAgg node
  green: '#10B981', // VIP quartile / CUME_DIST / P95 SLA seal
  amber: '#F59E0B', // PERCENTILE_CONT interpolation / Sort Node in-memory
  red: '#EF4444', // OVER() not supported error / Disk Spill alert
  purple: '#A855F7', // NTILE bucket slicing dividers
};

// Scene boundaries — audio ends at ~224.65s, 15.35s silence at end for outro fade
export const SCENES = {
  s1: {from: 0, dur: 1200},    // 0s    - 40s    NTILE bucket slicing
  s2: {from: 1200, dur: 1350}, // 40s   - 85s    PERCENT_RANK vs CUME_DIST
  s3: {from: 2550, dur: 1350}, // 85s   - 130s   PERCENTILE_CONT vs PERCENTILE_DISC
  s4: {from: 3900, dur: 1200}, // 130s  - 170s   Sort Node + WindowAgg + work_mem
  s5: {from: 5100, dur: 1200}, // 170s  - 210s   Enterprise NTILE + P95 SLA
  s6: {from: 6300, dur: 900},  // 210s  - 240s   Academy outro
};

export const START = {s1: 0, s2: 40, s3: 85, s4: 130, s5: 170, s6: 210};
