import {loadFont as loadOrbitron} from '@remotion/google-fonts/Orbitron';
import {loadFont as loadMono} from '@remotion/google-fonts/ShareTechMono';
import {loadFont as loadGrotesk} from '@remotion/google-fonts/SpaceGrotesk';

export const ORB = loadOrbitron('normal', {weights: ['500', '700', '900'], subsets: ['latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const GROTESK = loadGrotesk('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;
export const CAIRO = GROTESK; // legacy alias used by shared ui helpers
