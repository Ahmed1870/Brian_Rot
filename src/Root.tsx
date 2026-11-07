import React from 'react';
import {Composition} from 'remotion';
import {Lesson62} from './Lesson62';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L62" component={Lesson62} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
