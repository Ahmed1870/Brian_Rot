import React from 'react';
import {Composition} from 'remotion';
import {BrainRotViral} from './Composition';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="BrainRotViral" component={BrainRotViral} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
