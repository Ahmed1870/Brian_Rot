import {loadFont as loadArabic} from '@remotion/google-fonts/ArefRuqaa';
import {loadFont as loadHand} from '@remotion/google-fonts/Caveat';

// عربي بخط رقعة يدوي + إنجليزي/معادلات/أكواد بخط Caveat اليدوي (شكل طباشير)
export const {fontFamily: AR} = loadArabic('normal', {weights: ['400', '700'], subsets: ['arabic', 'latin']});
export const {fontFamily: EN} = loadHand('normal', {weights: ['500', '700'], subsets: ['latin']});
