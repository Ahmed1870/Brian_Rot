import React from 'react';
import {Composition} from 'remotion';
import {Video} from './Video';
import {FPS, H, TOTAL_FRAMES, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="SQL-L49-Expression-MultiColumn-Indexes" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
