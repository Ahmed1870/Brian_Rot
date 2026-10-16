import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {C, CENTER, T} from './theme';
import {ORB} from './fonts';
import {Backdrop, CoreDot, GlitchText, Overlay, Shock} from './lib/fx';
import {HoloSphere} from './lib/Holo';
import {Chaos, ChaosFx} from './lib/Chaos';
import {Dash} from './lib/Dash';
import {Brand} from './lib/Brand';
import {clamp, easeInOut, easeOut, hash, ramp} from './lib/anim';

const ChainText: React.FC<{from: number; to: number; y: number}> = ({from, to, y}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 8) return null;
  const words = ['DATA', 'INSIGHT', 'ACTION'];
  const op = ramp(f, from, from + 6) * (1 - ramp(f, to, to + 8));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: op}}>
      {words.map((w, i) => {
        const k = easeOut(ramp(f, from + i * 16, from + i * 16 + 14));
        return (
          <React.Fragment key={w}>
            <div style={{fontFamily: ORB, fontWeight: 900, fontSize: 46, color: i === 2 ? C.green : i === 1 ? C.gold : C.cyan, opacity: k,
              textShadow: '0 0 22px currentColor', transform: `translateY(${(1 - k) * 30}px)`}}>{w}</div>
            {i < 2 ? (
              <svg width={64} height={30} viewBox="0 0 64 30" style={{opacity: k}}>
                <path d="M2 15 H54 M42 4 L56 15 L42 26" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export const Main: React.FC = () => {
  const f = useCurrentFrame();

  // phase signals
  const laser = f < 70 ? easeOut(ramp(f, 8, 36)) * (1 - ramp(f, 44, 70)) : 0;
  const reveal = easeInOut(ramp(f, 42, 112));
  const sphereAlpha = (1 - ramp(f, T.s3, T.s3 + 20)) * (f < T.s3 + 24 ? 1 : 0);
  const chaosK = f >= T.s2 && f < T.s3 ? ramp(f, T.s2, T.s3 - 20) : 0;
  const cam = easeInOut(ramp(f, T.s4 + 10, T.s4 + 215)) * 1100;
  const dashOn = f >= T.s3 + 20 && f < T.s5 + 24;
  const dashOut = f > T.s5 ? 1 - ramp(f, T.s5, T.s5 + 22) : 1;
  const shake = f >= T.s3 && f < T.s3 + 18 ? Math.exp(-(f - T.s3) / 5) * 22 : 0;
  const flare = f >= T.s3 ? Math.max(0, 1 - (f - T.s3) / 40) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <Audio src={staticFile('audio_0.mp3')} />
      <Audio src={staticFile('sfx.wav')} volume={0.55} />
      <Backdrop />
      <AbsoluteFill style={{transform: `translate(${Math.sin(f * 2.7) * shake}px, ${Math.cos(f * 2.1) * shake}px)`}}>
        {/* phase 1: laser + hologram sphere */}
        {laser > 0.01 ? (
          <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
            <rect x={CENTER.x - 2} y={CENTER.y - 960 * laser} width={4} height={1920 * laser} fill="#fff" style={{filter: 'drop-shadow(0 0 14px #00F0FF)'}} />
          </svg>
        ) : null}
        {f >= 40 && sphereAlpha > 0.01 ? (
          <HoloSphere f={f} reveal={Math.min(1, reveal)} color={f >= T.s2 + 30 ? (hash(Math.floor(f / 3)) > 0.78 ? C.red : C.cyan) : C.cyan}
            jitter={f >= T.s2 ? 6 + chaosK * 14 : 1.5} alpha={sphereAlpha * (f >= T.s2 ? 0.55 : 1)} />
        ) : null}
        {/* phase 2/3: red chaos then magnetic collapse */}
        <Chaos />
        <ChaosFx />
        {/* phase 3/4: dashboard */}
        {dashOn ? <div style={{position: 'absolute', inset: 0, opacity: dashOut}}><Dash cam={cam} /></div> : null}
        <Shock f={f} at={T.s3} />
        <Brand />
      </AbsoluteFill>
      {/* anamorphic flare */}
      {flare > 0 ? <div style={{position: 'absolute', left: 0, right: 0, top: CENTER.y - 3, height: 6, opacity: flare,
        background: `linear-gradient(90deg, transparent, ${C.cyan}, #fff, ${C.gold}, transparent)`}} /> : null}
      <AbsoluteFill style={{background: '#CFFAFE', opacity: f >= T.s3 ? Math.max(0, 1 - (f - T.s3) / 6) * 0.8 : 0}} />

      {/* English typography */}
      <GlitchText text="SYSTEM: INITIALIZED" y={1560} size={50} from={58} to={128} color={C.cyan} />
      <GlitchText text="RAW DATA OVERLOAD" y={1560} size={50} from={134} to={196} color={C.red} glitch={1} />
      <GlitchText text="LOST IN THE NOISE?" y={1560} size={62} from={228} to={352} color={C.red} glitch={1.2} spacing={3} />
      <GlitchText text="TRANSFORMING CHAOS|INTO CLARITY" y={1590} size={50} from={T.s3 + 16} to={T.s3 + 176} color={C.cyan} glitch={0.5} />
      <ChainText from={T.s3 + 196} to={T.s4 - 6} y={1640} />
      <GlitchText text="DECISION UNLOCKED" y={1600} size={60} from={T.s4 + 14} to={T.s4 + 122} color={C.green} glitch={0.5} />
      <GlitchText text="GROWTH: OPTIMIZED" y={1600} size={60} from={T.s4 + 130} to={T.s5 - 6} color={C.gold} glitch={0.35} />

      <CoreDot />
      <Overlay />
    </AbsoluteFill>
  );
};
