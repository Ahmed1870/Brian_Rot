import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, SCENES} from './theme';
import {CAIRO} from './fonts';
import {Captions} from './components/Captions';
import {Scene1_FastHook} from './components/Scene1_FastHook';
import {Scene2_ValueBurst} from './components/Scene2_ValueBurst';
import {Scene3_FastCarousel} from './components/Scene3_FastCarousel';
import {Scene4_BrandCTA} from './components/Scene4_BrandCTA';
import {STEMS, VOICE} from './utils/audioConfig';

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const S = SCENES;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: CAIRO}}>
      <Audio src={staticFile(VOICE.file)} volume={VOICE.volume} />
      {STEMS.map((s, i) => <Sequence key={i} from={s.frame} layout="none"><Audio src={staticFile(s.file)} volume={s.volume} /></Sequence>)}
      {/* studio table: warm charcoal with a soft overhead light */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 38%, #24262B 0%, #121316 62%, #0C0D0F 100%)'}} />
      <Sequence from={S.s1.from} durationInFrames={S.s1.dur}><Scene1_FastHook f={f} /></Sequence>
      <Sequence from={S.s2.from} durationInFrames={S.s2.dur}><Scene2_ValueBurst f={f} /></Sequence>
      <Sequence from={S.s3.from} durationInFrames={S.s3.dur}><Scene3_FastCarousel f={f} /></Sequence>
      <Sequence from={S.s4.from} durationInFrames={S.s4.dur}><Scene4_BrandCTA f={f} /></Sequence>
      <Captions f={f} />
    </AbsoluteFill>
  );
};
