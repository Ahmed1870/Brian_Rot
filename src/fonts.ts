import {loadFont as loadArabic} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadMono} from '@remotion/google-fonts/IBMPlexMono';

export const {fontFamily: AR} = loadArabic('normal', {weights: ['500', '700'], subsets: ['arabic', 'latin']});
export const {fontFamily: MONO} = loadMono('normal', {weights: ['400', '500'], subsets: ['latin']});
