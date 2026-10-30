import React from 'react';
import {Composition} from 'remotion';
import {UnitEconomicsVideo} from './Video';
import {FPS, H, TOTAL, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Ahmed-UnitEconomics-L13"
    component={UnitEconomicsVideo}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={TOTAL}
  />
);
