import {loadFont as loadCairo} from '@remotion/google-fonts/Cairo';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

export const cairo = loadCairo('normal', {weights: ['400', '700', '900'], subsets: ['arabic', 'latin']}).fontFamily;
export const mono = loadMono('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily;
