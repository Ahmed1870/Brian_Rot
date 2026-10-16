import React from 'react';
import {Audio, staticFile} from 'remotion';

// مؤثر صوتي واحد (10 ثواني) متولّد برمجيًا — مفيش فويس أوفر نهائيًا.
export const AudioSFX: React.FC = () => <Audio src={staticFile('sfx_hyper_10s.wav')} volume={1} />;
