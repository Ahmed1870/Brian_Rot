import React from 'react';
import {Audio, staticFile} from 'remotion';

// الفويس أوفر (18s) + SFX Master (متولّد برمجيًا، 18s) — متزامنين على نفس الخط الزمني.
export const AudioMix: React.FC = () => (
  <>
    <Audio src={staticFile('vo_brand_voiceover_18s_final.wav')} volume={1} />
    <Audio src={staticFile('sfx_master_18s.wav')} volume={0.75} />
  </>
);
