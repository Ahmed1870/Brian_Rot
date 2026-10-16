import React from 'react';
import {Composition} from 'remotion';
import {BrainRotViral} from './Composition';

// 10 ثواني بالظبط = 300 فريم @ 30fps — بدون فويس أوفر.
export const RemotionRoot: React.FC = () => (
  <Composition id="BrainRotViral" component={BrainRotViral} durationInFrames={300} fps={30} width={1080} height={1920} />
);
