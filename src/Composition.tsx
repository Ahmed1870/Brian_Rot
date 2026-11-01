import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import './fonts';
import TL from './timeline.json';
import {C} from './theme';
import {clamp, eio, mix, prog, hash} from './lib/anim';
import {Hud} from './components/Hud';
import {Burst} from './components/Particles';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';

const SCENES: React.FC<{t: number}>[] = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
const FPS = TL.fps;

// ---- audio levels -------------------------------------------------------------------------------
const voiceActivity = (tt: number): number => {
  let a = 0;
  TL.voice.forEach(([s, e]) => {
    a = Math.max(a, Math.min(prog(tt, s - 0.3, s), 1 - prog(tt, e, e + 0.7)));
  });
  return a;
};
const bedVolume = (f: number): number => {
  const tt = f / FPS;
  const base = mix(TL.music.base, TL.music.duck, voiceActivity(tt));
  return base * prog(tt, 0, 2.5);
};
const outroVolume = (f: number): number => {
  const tt = TL.music.outroStart + f / FPS;
  const base = mix(0.2, TL.music.duck, voiceActivity(tt));
  return base * (1 - prog(tt, TL.music.outroFadeStart, TL.music.outroFadeEnd)) * prog(tt, TL.music.outroStart, TL.music.outroStart + 2);
};

// ---- scene layer with transitions --------------------------------------------------------------
const Layer: React.FC<{i: number; t: number}> = ({i, t}) => {
  const Scene = SCENES[i];
  const s = TL.scenes[i];
  const tr = TL.transitions[i];
  const prev = i > 0 ? TL.transitions[i - 1] : undefined;
  const out = tr && t >= s.end ? prog(t, s.end, s.end + tr.dur) : 0;
  const inn = prev && t < prev.at + prev.dur ? prog(t, prev.at, prev.at + prev.dur) : 1;
  const style: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zIndex: 30 - i, overflow: 'hidden'};

  if (inn < 1 && prev) {
    const e = eio(inn);
    if (prev.type === 'slide') {
      style.transform = `translateX(${(1 - e) * 420}px)`;
      style.opacity = 0.35 + 0.65 * e;
    } else if (prev.type === 'dissolve') {
      style.transform = `scale(${0.97 + 0.03 * e})`;
    } else if (prev.type === 'gridsplit') {
      style.transform = `scale(${0.93 + 0.07 * e})`;
    } else if (prev.type === 'implode') {
      style.transform = `scale(${1.2 - 0.2 * e})`;
      style.opacity = Math.min(1, e * 1.7);
    } else if (prev.type === 'slidedown') {
      style.transform = `translateY(${-(1 - e) * 140}px)`;
      style.opacity = e;
    }
  }

  if (out > 0 && tr) {
    const e = eio(out);
    if (tr.type === 'gridsplit') {
      const quads: {clip: string; dx: number; dy: number; rot: number}[] = [
        {clip: 'inset(0px 960px 540px 0px)', dx: -1, dy: -1, rot: -3},
        {clip: 'inset(0px 0px 540px 960px)', dx: 1, dy: -1, rot: 3},
        {clip: 'inset(540px 960px 0px 0px)', dx: -1, dy: 1, rot: 3},
        {clip: 'inset(540px 0px 0px 960px)', dx: 1, dy: 1, rot: -3},
      ];
      return (
        <div style={style}>
          {quads.map((q, k) => (
            <div key={k} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, clipPath: q.clip, transform: `translate(${q.dx * e * 1250}px, ${q.dy * e * 760}px) rotate(${q.rot * e}deg) scale(${1 - e * 0.25})`, opacity: 1 - e * e, transformOrigin: '960px 540px'}}>
              <Scene t={t} />
            </div>
          ))}
          <div style={{position: 'absolute', left: 959 - e * 6, top: 0, width: 2 + e * 12, height: 1080, background: C.accent, opacity: (1 - e) * 0.9, boxShadow: `0 0 40px ${C.accent}`}} />
          <div style={{position: 'absolute', top: 539 - e * 6, left: 0, height: 2 + e * 12, width: 1920, background: C.accent, opacity: (1 - e) * 0.9, boxShadow: `0 0 40px ${C.accent}`}} />
        </div>
      );
    }
    if (tr.type === 'slide') style.transform = `translateX(${-e * 1920}px)`;
    else if (tr.type === 'dissolve') {
      style.opacity = 1 - e;
      style.transform = `scale(${1 + 0.04 * e})`;
    } else if (tr.type === 'implode') {
      style.transform = `scale(${1 - 0.88 * e}) rotate(${e * 9}deg)`;
      style.opacity = 1 - e * e;
      style.transformOrigin = '960px 540px';
    } else if (tr.type === 'slidedown') {
      style.transform = `translateY(${e * 260}px)`;
      style.opacity = 1 - e;
    }
  }
  return (
    <div style={style}>
      <Scene t={t} />
    </div>
  );
};

const ImplodeOverlay: React.FC<{p: number}> = ({p}) => {
  if (p <= 0 || p >= 1) return null;
  const flare = Math.sin(clamp((p - 0.55) / 0.45) * Math.PI);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zIndex: 80, pointerEvents: 'none'}}>
      <Burst x={0} y={0} w={1920} h={1080} p={p} n={260} seed={4} inward={{x: 960, y: 540}} colors={[C.red, C.text, C.accent, C.amber]} size={13} />
      <div style={{position: 'absolute', left: 960 - 420, top: 540 - 420, width: 840, height: 840, borderRadius: '50%', background: `radial-gradient(circle, rgba(248,250,252,${0.85 * flare}) 0%, rgba(56,189,248,${0.5 * flare}) 25%, transparent 65%)`}} />
    </div>
  );
};

export const Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const layers: number[] = [];
  TL.scenes.forEach((s, i) => {
    const tr = TL.transitions[i];
    const to = tr ? s.end + tr.dur : s.end + 0.001;
    if (t >= s.start && t < to) layers.push(i);
  });
  const impl = TL.transitions[3];
  const implodeP = prog(t, impl.at, impl.at + impl.dur);
  const black = prog(t, TL.music.fadeBlack[0], TL.music.fadeBlack[1]);

  return (
    <AbsoluteFill style={{background: C.bg}}>
      {layers.map((i) => (
        <Layer key={i} i={i} t={t} />
      ))}
      <ImplodeOverlay p={implodeP} />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zIndex: 90, pointerEvents: 'none'}}>
        <Hud frame={frame} t={t} />
      </div>
      {black > 0 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: '#000', opacity: black, zIndex: 99}} /> : null}

      {/* Voiceover starts at frame 0: the mp3 is already 230s long and contains its own lead-in silence. */}
      <Audio src={staticFile('voiceover.mp3')} />
      <Sequence from={0} durationInFrames={Math.round(TL.music.bedEnd * FPS)}>
        <Audio src={staticFile('gen/bed.wav')} volume={bedVolume} />
      </Sequence>
      <Sequence from={Math.round(TL.music.outroStart * FPS)}>
        <Audio src={staticFile('gen/outro.wav')} volume={outroVolume} />
      </Sequence>
      {TL.sfx.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * FPS)}>
          <Audio src={staticFile('gen/' + s.file)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
