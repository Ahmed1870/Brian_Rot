import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {COMP_ID, DUR, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id={COMP_ID} component={Video} durationInFrames={DUR} fps={FPS} width={W} height={H} />
);
