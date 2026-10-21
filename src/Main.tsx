import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {SCENES, fr} from './theme';
import {Board} from './lib/board';
import {Scene1_Problem} from './components/Scene1_Problem';
import {Scene2_Scoring} from './components/Scene2_Scoring';
import {Scene3_CaseStudy} from './components/Scene3_CaseStudy';
import {Scene4_Tools} from './components/Scene4_Tools';
import {Scene5_Heatmap} from './components/Scene5_Heatmap';
import {Scene6_EndCTA} from './components/Scene6_EndCTA';
import {CUES, VOICE} from './utils/audioConfig';

const seq = (s: {from: number; to: number}, pad = 18) => ({from: fr(s.from) - 4, dur: fr(s.to) - fr(s.from) + pad + 4});

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const S = SCENES;
  const q = {s1: seq(S.s1), s2: seq(S.s2), s3: seq(S.s3), s4: seq(S.s4), s5: seq(S.s5), s6: seq(S.s6, 200)};
  return (
    <AbsoluteFill>
      <Audio src={staticFile(VOICE.file)} volume={VOICE.volume} />
      {CUES.map((c, i) => <Sequence key={i} from={fr(c.t)} layout="none"><Audio src={staticFile(c.file)} volume={c.volume} /></Sequence>)}
      <Board />
      <Sequence from={Math.max(0, q.s1.from)} durationInFrames={q.s1.dur}><Scene1_Problem f={f} /></Sequence>
      <Sequence from={q.s2.from} durationInFrames={q.s2.dur}><Scene2_Scoring f={f} /></Sequence>
      <Sequence from={q.s3.from} durationInFrames={q.s3.dur}><Scene3_CaseStudy f={f} /></Sequence>
      <Sequence from={q.s4.from} durationInFrames={q.s4.dur}><Scene4_Tools f={f} /></Sequence>
      <Sequence from={q.s5.from} durationInFrames={q.s5.dur}><Scene5_Heatmap f={f} /></Sequence>
      <Sequence from={q.s6.from} durationInFrames={q.s6.dur}><Scene6_EndCTA f={f} /></Sequence>
    </AbsoluteFill>
  );
};
