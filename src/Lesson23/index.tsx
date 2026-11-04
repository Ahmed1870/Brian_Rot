import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/common';
import { lin } from '../anim';
import { C, FONT_MONO } from '../theme';
import tl from '../timeline.json';
import { Scene01 } from './scenes/Scene01';
import { Scene02 } from './scenes/Scene02';
import { Scene03 } from './scenes/Scene03';
import { Scene04 } from './scenes/Scene04';
import { Scene05 } from './scenes/Scene05';
import { Scene06 } from './scenes/Scene06';

const SCENES = [Scene01, Scene02, Scene03, Scene04, Scene05, Scene06];
const OUT = 0.4; // outgoing overlap (s)
const IN = 0.5; // incoming fade/slide (s)


const Chrome: React.FC<{ t: number }> = ({ t }) => {
  const active = tl.scenes.findIndex((s, i) => t >= s && t < tl.scenes[i + 1]);
  const vis = lin(t, 1.2, 0.8) * (1 - lin(t, tl.scenes[5] - 0.4, 0.4));
  return (
    <g opacity={vis * 0.9}>
      <rect x={50} y={28} width={196} height={42} rx={21} fill={C.card} stroke={C.line} strokeWidth={2} />
      <text x={148} y={56} textAnchor="middle" fontFamily={FONT_MONO} fontSize={20} fontWeight={600} fill={C.client}>LESSON 23</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={1740 + i * 30} cy={49} r={i === active ? 9 : 6} fill={i < active ? C.db : i === active ? C.client : 'none'} stroke={i <= active ? 'none' : C.line} strokeWidth={3} />
      ))}
    </g>
  );
};

export const Lesson23: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const black = lin(t, tl.s6.fadeOut, tl.total - tl.s6.fadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Background />

      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {SCENES.map((S, i) => {
          const a = tl.scenes[i];
          const b = tl.scenes[i + 1];
          if (t < a || t >= b + OUT) return null;
          const inK = lin(t, a, IN);
          const outK = i < SCENES.length - 1 ? lin(t, b, OUT) : 0;
          const dx = (1 - inK) * 60 - outK * 60;
          return (
            <g key={i} opacity={(i === 0 ? 1 : inK) * (1 - outK)} transform={`translate(${dx} 0)`}>
              <S t={t} />
            </g>
          );
        })}
        <Chrome t={t} />
      </svg>

      <AbsoluteFill style={{ backgroundColor: '#000', opacity: black }} />

      {/* voiceover — aligned to frame 0 */}
      <Audio src={staticFile('voiceover_lesson_23.mp3')} volume={1} />

      {/* ambient tech pulse: 12% in the opening seconds, 8% under narration, out before the CTA */}
      <Sequence from={0} durationInFrames={6300} layout="none">
        <Audio
          src={staticFile('music/ambient.wav')}
          loop
          volume={(f) => (f < 150 ? 0.12 : 0.08) * (1 - Math.min(1, Math.max(0, (f - 6150) / 150)))}
        />
      </Sequence>

      {/* corporate outro, fade-out starts at frame 6600 */}
      <Sequence from={6300} durationInFrames={900} layout="none">
        <Audio
          src={staticFile('music/outro.wav')}
          volume={(f) => 0.1 * Math.min(1, f / 45) * (1 - Math.min(1, Math.max(0, (f - 750) / 150)))}
        />
      </Sequence>

      {/* SFX generated from timeline.json */}
      {tl.sfx.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * fps)} durationInFrames={Math.round(4.5 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${s.kind}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
