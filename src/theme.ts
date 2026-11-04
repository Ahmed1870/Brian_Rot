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
export const LESSON = 26;
export const COMP_ID = 'SQL-L26-Text-Regex';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // LOWER gate / expression index probe
  green: '#10B981', // INITCAP / ILIKE / regex pass / index seek
  amber: '#F59E0B', // UPPER / wildcard range
  red: '#EF4444', // LIKE mismatch / full table scan
};

// Scene boundaries sit in the REAL silence gaps of the voiceover
// Actual audio: 240.013s. Big natural gaps: 80.65-89.20s and 169.55-178.15s
// Planned boundaries 0|40|85|130|170|210|240 align perfectly with natural pauses.
export const SCENES = {
  s1: {from: 0, dur: 1200},    // 0s    - 40s    Case Normalization
  s2: {from: 1200, dur: 1350}, // 40s   - 85s    LIKE vs ILIKE
  s3: {from: 2550, dur: 1350}, // 85s   - 130s   Regex operators
  s4: {from: 3900, dur: 1200}, // 130s  - 170s   Expression Index
  s5: {from: 5100, dur: 1200}, // 170s  - 210s   Enterprise cleansing
  s6: {from: 6300, dur: 900},  // 210s  - 240s   Academy outro
};

// Scene start in seconds (absolute voiceover time)
export const START = {s1: 0, s2: 40, s3: 85, s4: 130, s5: 170, s6: 210};
