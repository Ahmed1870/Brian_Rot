import React from 'react';
import {Composition} from 'remotion';
import {Lesson38} from './Lesson38';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L38" component={Lesson38} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
