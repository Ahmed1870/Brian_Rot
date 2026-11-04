import React from 'react';
import {Composition} from 'remotion';
import {Lesson33} from './Lesson33';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L33" component={Lesson33} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
