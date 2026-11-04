import React from 'react';
import { Composition } from 'remotion';
import { Lesson23 } from './Lesson23';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="Ahmed-SQL-L23"
    component={Lesson23}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
