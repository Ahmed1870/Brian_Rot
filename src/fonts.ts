import {loadFont as loadCarlito} from '@remotion/google-fonts/Carlito';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

const carlito = loadCarlito('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;
export const ar = loadPlex('normal', {weights: ['400', '500', '600', '700'], subsets: ['arabic', 'latin']}).fontFamily;
export const mono = loadMono('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
// Carlito = open Calibri-metric font (Excel default look); Plex Arabic covers Arabic cell text
export const ui = `${carlito}, ${ar}, 'Segoe UI', sans-serif`;
