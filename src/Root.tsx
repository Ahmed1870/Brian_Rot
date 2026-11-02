import React from 'react';
import {Composition} from 'remotion';
import {Lesson11} from './Lesson11';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L11" component={Lesson11} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
