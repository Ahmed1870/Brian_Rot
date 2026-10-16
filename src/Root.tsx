import React from 'react';
import {Composition} from 'remotion';
import {CrackedScreenReel} from './CrackedScreenReel';

export const Root: React.FC = () => (
  <Composition
    id="CrackedScreenReel"
    component={CrackedScreenReel}
    durationInFrames={240}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{}}
  />
);
