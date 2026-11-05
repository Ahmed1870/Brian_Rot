import React from 'react';
import {Composition} from 'remotion';
import {Lesson34} from './Lesson34';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L34" component={Lesson34} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
