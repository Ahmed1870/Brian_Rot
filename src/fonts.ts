import {loadFont as loadCairo} from '@remotion/google-fonts/Cairo';
import {loadFont as loadGrotesk} from '@remotion/google-fonts/SpaceGrotesk';

export const CAIRO = loadCairo('normal', {weights: ['400', '700', '900'], subsets: ['arabic', 'latin']}).fontFamily;
export const GROTESK = loadGrotesk('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
