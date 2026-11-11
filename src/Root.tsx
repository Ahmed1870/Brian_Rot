import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {COMP_ID, FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id={COMP_ID} component={Video} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
