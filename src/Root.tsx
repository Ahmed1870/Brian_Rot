import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {COMP_ID, DUR, FPS, W, H} from './theme';

export const Root: React.FC = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={DUR} fps={FPS} width={W} height={H} />
);
