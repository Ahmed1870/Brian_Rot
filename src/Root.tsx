import React from 'react';
import {Composition} from 'remotion';
import {COMP_ID, DURATION, FPS, HEIGHT, WIDTH} from './theme';
import {Video} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
