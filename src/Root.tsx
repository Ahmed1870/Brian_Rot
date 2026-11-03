import React from 'react';
import {Composition} from 'remotion';
import {Lesson16} from './Lesson16';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L16" component={Lesson16} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
