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
export const LESSON = 39;
export const COMP_ID = 'SQL-L39-Running-Totals';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  deep: '#0B1222',
  border: '#334155',
  muted: '#94A3B8',
  text: '#F8FAFC',
  blue: '#38BDF8', // order frame / WindowAgg node
  green: '#10B981', // running total / smoothed trend / quality seal
  amber: '#F59E0B', // Sort Node / 7-day sliding window
  red: '#EF4444', // warning / volatility
  purple: '#A855F7', // implicit RANGE frame shading
};

// Scene boundaries sit in the REAL silence gaps of the voiceover
// Actual audio: 239.987s. Natural gaps at 38.75-41.2 / 83.7-86.15 / 128.8-131.15 / 168.75-171.15 / 208.75-211.2
export const SCENES = {
  s1: {from: 0, dur: 1200},    // 0s    - 40s    Running Totals concept
  s2: {from: 1200, dur: 1350}, // 40s   - 85s    Implicit RANGE frame
  s3: {from: 2550, dur: 1350}, // 85s   - 130s   Moving Averages sliding window
  s4: {from: 3900, dur: 1200}, // 130s  - 170s   Sort Node + WindowAgg pipeline
  s5: {from: 5100, dur: 1200}, // 170s  - 210s   Enterprise YTD dashboard
  s6: {from: 6300, dur: 900},  // 210s  - 240s   Academy outro
};

// Scene start in seconds (absolute voiceover time)
export const START = {s1: 0, s2: 40, s3: 85, s4: 130, s5: 170, s6: 210};
