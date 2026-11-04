import React from 'react';
import {Composition} from 'remotion';
import {Lesson19} from './Lesson19';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L19" component={Lesson19} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
