import React from 'react';
import {Composition} from 'remotion';
import {Lesson43} from './Lesson43';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L43" component={Lesson43} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
