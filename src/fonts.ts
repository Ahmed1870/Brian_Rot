import {loadFont as loadCairo} from '@remotion/google-fonts/Cairo';

export const CAIRO = loadCairo('normal', {weights: ['800', '900'], subsets: ['arabic', 'latin']}).fontFamily;
