import React from 'react';
import {Composition} from 'remotion';
import {Lesson05} from './Lesson05';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L05" component={Lesson05} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
