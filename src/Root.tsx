import React from 'react';
import {Composition} from 'remotion';
import {Lesson13} from './Lesson13';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition id="Ahmed-SQL-L13" component={Lesson13} width={W} height={H} fps={FPS} durationInFrames={TOTAL} />
);
