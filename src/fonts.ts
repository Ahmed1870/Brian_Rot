import {loadFont as loadCairo} from '@remotion/google-fonts/Cairo';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadSerif} from '@remotion/google-fonts/NotoSerif';

export const CAIRO = loadCairo('normal', {weights: ['700', '900'], subsets: ['arabic', 'latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;
export const MATH = loadSerif('normal', {weights: ['400', '700'], subsets: ['latin', 'greek']}).fontFamily;
export const MATH_I = loadSerif('italic', {weights: ['400', '700'], subsets: ['latin', 'greek']}).fontFamily;
