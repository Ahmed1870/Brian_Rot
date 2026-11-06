import React from 'react';
import {Composition} from 'remotion';
import {Lesson48} from './Lesson48';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L48" component={Lesson48} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
