import React from 'react';
import { Composition } from 'remotion';
import { COMP_ID, FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from './theme';
import { Lesson } from './Lesson';

export const RemotionRoot: React.FC = () => (
  <Composition id={COMP_ID} component={Lesson} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
