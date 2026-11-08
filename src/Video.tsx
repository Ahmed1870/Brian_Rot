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
const keys = (a: number[]): Cue[] => a.map((t) => [t, 'key', 0.5] as Cue);
// sound-design cues, absolute seconds in the voiceover timeline (aligned with the on-screen events)
const CUES: Cue[] = [
  [0.1, 'whoosh', 0.35],
  [16.3, 'click', 0.5], [19.1, 'pop', 0.5], [20.35, 'click', 0.5], [21.9, 'pop', 0.5], [22.6, 'key', 0.5], [23.4, 'click', 0.5], [24.35, 'click', 0.5], [25.4, 'click', 0.5], [25.55, 'ping', 0.5], [31.85, 'click', 0.5], [34.1, 'click', 0.5],
  [40.1, 'whoosh', 0.3], [41.6, 'scroll', 0.5], [46.0, 'alert', 0.45], [51.0, 'scroll', 0.35], [54.5, 'click', 0.5], [57.0, 'click', 0.5], [60.3, 'lock', 0.6], [60.6, 'scroll', 0.3],
  ...keys([61.2, 61.55, 61.9, 62.25]), [63.55, 'click', 0.5], [64.4, 'click', 0.5], [67.5, 'click', 0.5],
  ...keys([71.1, 71.45, 71.8, 72.15]), [72.4, 'lock', 0.6], [78.4, 'scroll', 0.4],
  [85.1, 'whoosh', 0.3], [90.6, 'click', 0.5], [93.9, 'glass', 0.6], ...keys([98.2, 98.55, 98.9]), [107.9, 'scroll', 0.5], [111.6, 'scroll', 0.3], [116.8, 'bar', 0.6],
  [130.1, 'whoosh', 0.3], [139.1, 'click', 0.5], ...keys([140.7, 141.0, 141.32]), [141.0, 'window', 0.6], [144.2, 'click', 0.5], [146.2, 'click', 0.5], ...keys([146.9, 147.2, 147.47]), [146.3, 'whoosh', 0.4],
  ...keys([150.6, 150.95, 151.25, 151.55]), [152.5, 'click', 0.5], [152.95, 'click', 0.5], [153.0, 'whoosh', 0.4], [155.6, 'scroll', 0.5], [159.0, 'scroll', 0.4], [162.6, 'scroll', 0.4], [166.0, 'scroll', 0.3],
  [170.1, 'whoosh', 0.3], [172.0, 'pop', 0.4], [180.6, 'scroll', 0.5], [185.4, 'click', 0.5], [185.85, 'click', 0.5], ...keys([186.8, 187.1, 187.4, 187.7]), [187.9, 'lock', 0.6], [189.0, 'scroll', 0.3],
  ...keys([189.6, 189.9, 190.2]), [190.4, 'window', 0.6], ...keys([191.2, 191.5, 191.8]), [191.9, 'whoosh', 0.4], [192.95, 'click', 0.5], [194.0, 'scroll', 0.5], [197.4, 'scroll', 0.4], [199.56, 'seal', 0.7],
  [210.15, 'whoosh', 0.4], [212.0, 'pop', 0.4], [212.7, 'pop', 0.4], [213.4, 'pop', 0.4], [214.1, 'pop', 0.4], [216.1, 'ping', 0.5], [223.48, 'whoosh', 0.4], [227.88, 'ping', 0.45],
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
