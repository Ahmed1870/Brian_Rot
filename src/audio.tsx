import React from 'react';
import {Audio, staticFile} from 'remotion';

// الفويس أوفر + SFX Master (متولّد برمجيًا) — الاتنين 35 ثانية بالظبط.
export const AudioMix: React.FC = () => (
  <>
    <Audio src={staticFile('vo_monzoma_digital_no_urls_35s.wav')} volume={1} />
    <Audio src={staticFile('sfx_master_35s.wav')} volume={0.7} />
  </>
);
