import { loadFont as loadCairo } from '@remotion/google-fonts/Cairo';
import { loadFont as loadMono } from '@remotion/google-fonts/IBMPlexMono';

export const C = {
  bg: '#0F172A',
  card: '#1E293B',
  cardDeep: '#172033',
  line: '#334155',
  client: '#38BDF8',
  db: '#10B981',
  opt: '#F59E0B',
  accent: '#EF4444',
  purple: '#A855F7',
  text: '#F8FAFC',
  muted: '#94A3B8',
};

const cairo = loadCairo('normal', { weights: ['400', '700', '900'], subsets: ['arabic', 'latin'] });
const mono = loadMono('normal', { weights: ['400', '600'], subsets: ['latin'] });

export const FONT_AR = `${cairo.fontFamily}, sans-serif`;
export const FONT_MONO = `${mono.fontFamily}, monospace`;
