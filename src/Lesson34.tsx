import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {CUES, S, VOICE_START} from './theme';
import {cairo} from './fonts';
import {HAS_VOICEOVER} from './generated';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';

export const Lesson34: React.FC = () => (
  <AbsoluteFill style={{fontFamily: cairo, backgroundColor: '#0F172A'}}>
    {HAS_VOICEOVER && (
      <Sequence from={VOICE_START}>
        <Audio src={staticFile('voiceover_lesson_34.mp3')} volume={1} />
      </Sequence>
    )}
    <Sequence from={0} durationInFrames={6300}>
      <Audio src={staticFile('sfx/music_loop.wav')} volume={(f) => interpolate(f, [0, 30, 6240, 6300], [0, 0.08, 0.08, 0], {extrapolateRight: 'clamp'})} loop />
    </Sequence>
    <Sequence from={6300} durationInFrames={900}>
      <Audio src={staticFile('sfx/outro_track.wav')} volume={(f) => interpolate(f, [0, 30, 750, 900], [0, 0.22, 0.22, 0], {extrapolateRight: 'clamp'})} />
    </Sequence>

    <Sequence from={S.s1.from} durationInFrames={S.s1.dur}><Scene01 /></Sequence>
    <Sequence from={S.s2.from} durationInFrames={S.s2.dur}><Scene02 /></Sequence>
    <Sequence from={S.s3.from} durationInFrames={S.s3.dur}><Scene03 /></Sequence>
    <Sequence from={S.s4.from} durationInFrames={S.s4.dur}><Scene04 /></Sequence>
    <Sequence from={S.s5.from} durationInFrames={S.s5.dur}><Scene05 /></Sequence>
    <Sequence from={S.s6.from} durationInFrames={S.s6.dur}><Scene06 /></Sequence>

    {CUES.map((c, i) => (
      <Sequence key={i} from={c.frame} durationInFrames={150} layout="none">
        <Audio src={staticFile(`sfx/${c.file}.wav`)} volume={c.vol ?? 0.6} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
