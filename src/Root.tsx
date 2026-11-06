import React from 'react';
import { Composition } from 'remotion';
import { Lesson31 } from './Lesson31';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="Ahmed-SQL-L31"
    component={Lesson31}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
