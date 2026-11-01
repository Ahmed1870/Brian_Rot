import React from 'react';
import { Composition } from 'remotion';
import { Lesson05 } from './Lesson05';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="Monzoma-SQL-L05"
    component={Lesson05}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
