import React from 'react';
import { Composition } from 'remotion';
import { Lesson61 } from './Lesson61';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="Ahmed-SQL-L61"
    component={Lesson61}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
