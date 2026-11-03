import React from 'react';
import {Composition} from 'remotion';
import {Lesson18} from './Lesson18';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L18" component={Lesson18} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
