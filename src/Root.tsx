import {Composition} from 'remotion';
import {Video} from './Video';
import {COMP_ID, FPS, WIDTH, HEIGHT, TOTAL_FRAMES} from './theme';

export const Root = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
