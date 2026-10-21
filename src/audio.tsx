import React from 'react';
import {Audio, staticFile} from 'remotion';

// الفويس أوفر (209s) + SFX طباشير/مسح/نقرات (210s) متولّد برمجيًا من نفس timeline.json
export const AudioMix: React.FC = () => (
  <>
    <Audio src={staticFile('vo_unit_economics_3m29.wav')} volume={1} />
    <Audio src={staticFile('sfx_chalk_210s.wav')} volume={0.55} />
  </>
);
