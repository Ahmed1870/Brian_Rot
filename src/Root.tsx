import React from 'react';
import {Composition} from 'remotion';
import {Lesson} from './Composition';
import TL from './timeline.json';

// The composition ID must stay "BrainRotViral" - the GitHub Actions workflow renders it by name.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="BrainRotViral"
      component={Lesson}
      durationInFrames={Math.round(TL.duration * TL.fps)}
      fps={TL.fps}
      width={TL.width}
      height={TL.height}
    />
  );
};
