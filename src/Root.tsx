import React from 'react';
import { Composition } from 'remotion';
import { Lesson02 } from './Lesson02';
import tl from './timeline.json';

export const Root: React.FC = () => (
  <Composition
    id="BrainRotViral"
    component={Lesson02}
    durationInFrames={tl.total * tl.fps}
    fps={tl.fps}
    width={1920}
    height={1080}
  />
);
