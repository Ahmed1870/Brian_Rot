import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Cairo';
import {CUES, S} from './theme';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';

export const {fontFamily} = loadFont('normal', {weights: ['400', '700', '900'], subsets: ['arabic', 'latin']});

export const UnitEconomicsVideo: React.FC = () => (
  <AbsoluteFill style={{fontFamily, direction: 'rtl', backgroundColor: '#0D0D0D'}}>
    {/* Voiceover (4:30 exactly) + generated music bed */}
    <Audio src={staticFile('voiceover.mp3')} volume={1} />
    <Audio src={staticFile('sfx/music_loop.wav')} volume={0.09} loop />

    <Sequence from={S.s1.from} durationInFrames={S.s1.dur}><Scene1 /></Sequence>
    <Sequence from={S.s2.from} durationInFrames={S.s2.dur}><Scene2 /></Sequence>
    <Sequence from={S.s3.from} durationInFrames={S.s3.dur}><Scene3 /></Sequence>
    <Sequence from={S.s4.from} durationInFrames={S.s4.dur}><Scene4 /></Sequence>
    <Sequence from={S.s5.from} durationInFrames={S.s5.dur}><Scene5 /></Sequence>
    <Sequence from={S.s6.from} durationInFrames={S.s6.dur}><Scene6 /></Sequence>

    {/* Generated sound effects */}
    {CUES.map((c, i) => (
      <Sequence key={i} from={c.frame} durationInFrames={150} layout="none">
        <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol ?? 0.7} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
