import {loadFont as loadCairo} from '@remotion/google-fonts/Cairo';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';

// Arabic UI font + code font. Loaded at module level so every scene shares them.
export const cairo = loadCairo('normal', {
  weights: ['400', '600', '700', '800', '900'],
  subsets: ['arabic', 'latin'],
});
export const mono = loadMono('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
});
