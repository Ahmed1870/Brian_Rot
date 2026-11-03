import React from 'react';
import { Composition } from 'remotion';
import { Lesson07 } from './Lesson07';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="Monzoma-SQL-L07"
    component={Lesson07}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
