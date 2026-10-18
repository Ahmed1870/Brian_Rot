import React from 'react';
import {Composition} from 'remotion';
import {MuseumReel} from './MuseumReel';
import {DURATION, FPS, HEIGHT, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="BrainRotViral" component={MuseumReel} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
