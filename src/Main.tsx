import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {SCENES, fr} from './theme';
import {Board} from './lib/board';
import {Captions} from './lib/ar';
import {Scene1_Puzzle} from './components/Scene1_Puzzle';
import {Scene2_Apriori} from './components/Scene2_Apriori';
import {Scene3_Code} from './components/Scene3_Code';
import {Scene4_Outro} from './components/Scene4_Outro';
import {CUES, VOICE} from './utils/audioConfig';

const seq = (s: {from: number; to: number}, pad = 18) => ({from: Math.max(0, fr(s.from) - 18), dur: fr(s.to) - Math.max(0, fr(s.from) - 18) + pad});

export const Main: React.FC = () => {
  const f = useCurrentFrame();
  const q = {s1: seq(SCENES.s1), s2: seq(SCENES.s2), s3: seq(SCENES.s3), s4: seq(SCENES.s4, 200)};
  return (
    <AbsoluteFill>
      <Audio src={staticFile(VOICE.file)} volume={VOICE.volume} />
      {CUES.map((c, i) => <Sequence key={i} from={fr(c.t)} layout="none"><Audio src={staticFile(c.file)} volume={c.volume} /></Sequence>)}
      <Board />
      <Sequence from={q.s1.from} durationInFrames={q.s1.dur}><Scene1_Puzzle f={f} /></Sequence>
      <Sequence from={q.s2.from} durationInFrames={q.s2.dur}><Scene2_Apriori f={f} /></Sequence>
      <Sequence from={q.s3.from} durationInFrames={q.s3.dur}><Scene3_Code f={f} /></Sequence>
      <Sequence from={q.s4.from} durationInFrames={q.s4.dur}><Scene4_Outro f={f} /></Sequence>
      <Captions f={f} />
    </AbsoluteFill>
  );
};
