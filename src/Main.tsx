import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, SCENES} from './theme';
import {CAIRO} from './fonts';
import {Captions} from './components/Captions';
import {Scene1_Hook} from './components/Scene1_Hook';
import {Scene2_BusinessDamage} from './components/Scene2_BusinessDamage';
import {Scene3_MedianSolution} from './components/Scene3_MedianSolution';
import {Scene4_EcosystemHubs} from './components/Scene4_EcosystemHubs';
import {Scene5_BrandContactCTA} from './components/Scene5_BrandContactCTA';
import {STEMS, VOICE} from './utils/audioConfig';

const Backdrop: React.FC<{f: number}> = ({f}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <radialGradient id="mbg" cx="50%" cy="38%" r="75%"><stop offset="0" stopColor="#1E293B" /><stop offset="1" stopColor={C.bg} /></radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#mbg)" />
    {Array.from({length: 40}, (_, i) => {
      const x = ((i * 137.5) % 1080), y = ((i * 311.3 + f * (0.2 + (i % 5) * 0.1)) % 1920);
      return <circle key={i} cx={x} cy={y} r={1 + (i % 3)} fill="#94A3B8" opacity={0.12 + (i % 4) * 0.05} />;
    })}
  </svg>
);

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  let sx = 0, sy = 0;
  if (f >= 120) { const d = Math.exp(-(f - 120) / 6); sx = Math.sin((f - 120) * 2.4) * 14 * d; sy = Math.cos((f - 120) * 1.9) * 18 * d; }
  const S = SCENES;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, fontFamily: CAIRO}}>
      <Audio src={staticFile(VOICE.file)} volume={VOICE.volume} />
      {STEMS.map((s) => <Sequence key={s.file} from={s.frame} layout="none"><Audio src={staticFile(s.file)} volume={s.volume} /></Sequence>)}
      <Backdrop f={f} />
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px)`}}>
        <Sequence from={S.s1.from} durationInFrames={S.s1.dur}><Scene1_Hook f={f} /></Sequence>
        <Sequence from={S.s2.from} durationInFrames={S.s2.dur}><Scene2_BusinessDamage f={f} /></Sequence>
        <Sequence from={S.s3.from} durationInFrames={S.s3.dur}><Scene3_MedianSolution f={f} /></Sequence>
        <Sequence from={S.s4.from} durationInFrames={S.s4.dur}><Scene4_EcosystemHubs f={f} /></Sequence>
        <Sequence from={S.s5.from} durationInFrames={S.s5.dur}><Scene5_BrandContactCTA f={f} /></Sequence>
      </AbsoluteFill>
      <Captions f={f} />
    </AbsoluteFill>
  );
};
