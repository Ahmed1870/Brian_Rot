import React from 'react';
import { Composition } from 'remotion';
import { Lesson06 } from './Lesson06';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="Monzoma-SQL-L06"
    component={Lesson06}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
