import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {SC, VOICE} from './theme';
import {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6} from './scenes';
import {clamp, kf} from './kit';

// 2D scene transitions (plan: zoom / slide-left / slide-down / expand / fade)
const Trans: React.FC<{kind: number; children: React.ReactNode}> = ({kind, children}) => {
  const p = clamp(useCurrentFrame() / 14);
  const e = kf(p, [[0, 0], [1, 1]]);
  const tf = ['none', `scale(${1.08 - 0.08 * e})`, `translateX(${(1 - e) * 140}px)`, `translateY(${(1 - e) * -90}px)`, `scale(${0.94 + 0.06 * e})`, 'none'][kind];
  return <AbsoluteFill style={{opacity: kind === 0 ? 1 : e, transform: tf}}>{children}</AbsoluteFill>;
};

// Voiceover + ONE pre-mixed soundtrack (sound effects + music, 240 s, aligned to the voice anchors)
const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#0F172A'}}>
    <Audio src={staticFile(VOICE)} />
    <Audio src={staticFile('soundtrack_lesson_57.wav')} />
    {[Scene1, Scene2, Scene3, Scene4, Scene5, Scene6].map((S, i) => (
      <Sequence key={i} from={SC[i].from} durationInFrames={SC[i].dur}>
        <Trans kind={i}><S from={SC[i].from} /></Trans>
      </Sequence>
    ))}
  </AbsoluteFill>
);
export {Video};
