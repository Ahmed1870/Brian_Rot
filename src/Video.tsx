import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, SC, VOICE} from './theme';
import {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6} from './scenes';
import {clamp, kf} from './kit';

// 2D scene transitions (plan: zoom / slide-left / slide-down / expand / fade)
const Trans: React.FC<{kind: number; children: React.ReactNode}> = ({kind, children}) => {
  const p = clamp(useCurrentFrame() / 14);
  const e = kf(p, [[0, 0], [1, 1]]);
  const tf = [
    'none', `scale(${1.08 - 0.08 * e})`, `translateX(${(1 - e) * 140}px)`, `translateY(${(1 - e) * -90}px)`, `scale(${0.94 + 0.06 * e})`, 'none',
  ][kind];
  return <AbsoluteFill style={{opacity: kind === 0 ? 1 : e, transform: tf}}>{children}</AbsoluteFill>;
};

type Cue = [number, string, number?];
// sound-design cues, absolute seconds in the voiceover timeline (aligned with the on-screen events)
const CUES: Cue[] = [
  [0.1, 'whoosh', 0.35], [1.5, 'click', 0.5], [14.7, 'pop', 0.5], [16.58, 'pop', 0.5], [19.11, 'switch', 0.55], [21.9, 'whoosh', 0.3], [26.0, 'stream', 0.5], [28.5, 'ping', 0.5], [29.6, 'stream', 0.5], [32.0, 'pop', 0.5],
  [40.1, 'whoosh', 0.3], [48.23, 'pop', 0.5], [56.4, 'lock', 0.6], [59.8, 'lock', 0.6], [62.5, 'pop', 0.45], [65.8, 'ping', 0.5], [67.94, 'whoosh', 0.3], [68.5, 'lock', 0.6], [69.6, 'alert', 0.45], [70.6, 'pop', 0.5],
  [85.1, 'whoosh', 0.3], [98.25, 'pop', 0.5], [101.6, 'click', 0.5], [108.0, 'switch', 0.55], [108.2, 'stream', 0.5], [110.4, 'ping', 0.5],
  [130.1, 'whoosh', 0.3], [135.8, 'step', 0.5], [137.86, 'step', 0.5], [139.13, 'step', 0.5], [139.4, 'stream', 0.45], [141.2, 'ping', 0.5], [146.82, 'whoosh', 0.35], [147.2, 'step', 0.45], [147.5, 'step', 0.45], [147.8, 'step', 0.45], [149.0, 'stream', 0.45], [151.0, 'alert', 0.5], [152.39, 'alert', 0.45], [156.85, 'ping', 0.5],
  [170.1, 'whoosh', 0.3], [172.0, 'pop', 0.4], [183.6, 'click', 0.5], [188.4, 'ping', 0.5], [188.6, 'scroll', 0.5], [190.8, 'click', 0.5], [194.8, 'ping', 0.5], [195.0, 'scroll', 0.5], [198.5, 'seal', 0.7],
  [210.15, 'whoosh', 0.4], [212.0, 'pop', 0.4], [212.7, 'pop', 0.4], [213.4, 'pop', 0.4], [214.1, 'pop', 0.4], [216.2, 'ping', 0.5], [222.93, 'whoosh', 0.4], [228.45, 'ping', 0.45],
];
const AMB = SC[5].from;
const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#0F172A'}}>
    <Audio src={staticFile(VOICE)} />
    <Sequence from={0} durationInFrames={AMB}>
      <Audio src={staticFile('sfx/music_amb.wav')} loop volume={(f) => 0.07 * clamp(f / 45) * clamp((AMB - f) / 45)} />
    </Sequence>
    <Sequence from={AMB}>
      <Audio src={staticFile('sfx/music_outro.wav')} volume={0.1} />
    </Sequence>
    {CUES.map(([t, n, v], i) => (
      <Sequence key={i} from={Math.round(t * FPS)} durationInFrames={FPS * 3}>
        <Audio src={staticFile(`sfx/${n}.wav`)} volume={v ?? 0.5} />
      </Sequence>
    ))}
    {[Scene1, Scene2, Scene3, Scene4, Scene5, Scene6].map((S, i) => (
      <Sequence key={i} from={SC[i].from} durationInFrames={SC[i].dur}>
        <Trans kind={i}><S from={SC[i].from} /></Trans>
      </Sequence>
    ))}
  </AbsoluteFill>
);
export {Video};
