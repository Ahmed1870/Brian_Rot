import React from 'react';
import {Composition} from 'remotion';
import {Lesson} from './Composition';
import TL from './timeline.json';

// One unique composition ID per lesson (Monzoma-SQL-Lxx). The workflow calls `npm run render`, so it never needs editing.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Monzoma-SQL-L50"
      component={Lesson}
      durationInFrames={Math.round(TL.duration * TL.fps)}
      fps={TL.fps}
      width={TL.width}
      height={TL.height}
    />
  );
};
