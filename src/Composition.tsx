import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import './fonts';
import TL from './timeline.json';
import {C} from './theme';
import {eio, mix, prog} from './lib/anim';
import {Hud} from './components/Hud';
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
  return mix(TL.music.base, TL.music.duck, voiceActivity(tt)) * prog(tt, 0, 2.5);
};
const outroVolume = (f: number): number => {
  const tt = TL.music.outroStart + f / FPS;
  const base = mix(0.2, TL.music.duck, voiceActivity(tt));
  return base * (1 - prog(tt, TL.music.outroFadeStart, TL.music.outroFadeEnd)) * prog(tt, TL.music.outroStart, TL.music.outroStart + 2);
};

// ---- scene layer with strictly 2D transitions ------------------------------------------------------
const Layer: React.FC<{i: number; t: number}> = ({i, t}) => {
  const Scene = SCENES[i];
  const s = TL.scenes[i];
  const tr = TL.transitions[i];
  const prev = i > 0 ? TL.transitions[i - 1] : undefined;
  const out = tr && t >= s.end ? prog(t, s.end, s.end + tr.dur) : 0;
  const inn = prev && t < prev.at + prev.dur ? prog(t, prev.at, prev.at + prev.dur) : 1;
  const style: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zIndex: 30 - i, overflow: 'hidden'};
  let ring: React.ReactNode = null;

  if (inn < 1 && prev) {
    const e = eio(inn);
    if (prev.type === 'zoom') {
      style.transform = `scale(${0.9 + 0.1 * e})`;
      style.opacity = 0.4 + 0.6 * e;
    } else if (prev.type === 'slide') {
      style.transform = `translateX(${(1 - e) * 420}px)`;
      style.opacity = 0.35 + 0.65 * e;
    } else if (prev.type === 'morph') {
      style.transform = `scale(${0.96 + 0.04 * e})`;
    } else if (prev.type === 'gridshift') {
      style.transform = `translate(${(1 - e) * 520}px, ${(1 - e) * 300}px)`;
      style.opacity = 0.3 + 0.7 * e;
    } else if (prev.type === 'slidedown') {
      style.transform = `translateY(${-(1 - e) * 140}px)`;
      style.opacity = e;
    } else if (prev.type === 'vslide') {
      style.transform = `translateY(${(1 - e) * 1080}px)`;
    } else if (prev.type === 'expand') {
      style.clipPath = `inset(${(1 - e) * 22}% ${(1 - e) * 22}% round ${40 * (1 - e)}px)`;
      style.transform = `scale(${0.9 + 0.1 * e})`;
    }
  }
  if (out > 0 && tr) {
    const e = eio(out);
    if (tr.type === 'zoom') {
      style.transform = `scale(${1 + 2.6 * e})`;
      style.transformOrigin = '480px 470px';
      style.opacity = 1 - e * e;
    } else if (tr.type === 'slide') {
      style.transform = `translateX(${-e * 1920}px)`;
    } else if (tr.type === 'morph') {
      const R = mix(1260, 0, e);
      style.clipPath = `circle(${R}px at 960px 540px)`;
      ring = <div style={{position: 'absolute', left: 960 - R, top: 540 - R, width: R * 2, height: R * 2, borderRadius: '50%', border: `${6 + 10 * (1 - e)}px solid ${C.green}`, boxShadow: `0 0 60px ${C.green}, inset 0 0 60px ${C.green}`, opacity: Math.min(1, R / 60), zIndex: 40 - i}} />;
    } else if (tr.type === 'gridshift') {
      style.transform = `translate(${-e * 1150}px, ${-e * 650}px)`;
      style.opacity = 1 - e * 0.9;
    } else if (tr.type === 'slidedown') {
      style.transform = `translateY(${e * 260}px)`;
      style.opacity = 1 - e;
    } else if (tr.type === 'vslide') {
      style.transform = `translateY(${-e * 1080}px)`;
    } else if (tr.type === 'expand') {
      style.transform = `scale(${1 + 0.06 * e})`;
      style.opacity = 1 - e;
    }
  }
  return (
    <>
      <div style={style}>
        <Scene t={t} />
      </div>
      {ring ? <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, overflow: 'hidden', pointerEvents: 'none', zIndex: 60}}>{ring}</div> : null}
    </>
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
  const black = prog(t, TL.music.fadeBlack[0], TL.music.fadeBlack[1]);

  return (
    <AbsoluteFill style={{background: C.bg}}>
      {layers.map((i) => (
        <Layer key={i} i={i} t={t} />
      ))}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, zIndex: 90, pointerEvents: 'none'}}>
        <Hud frame={frame} t={t} />
      </div>
      {black > 0 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, background: '#000', opacity: black, zIndex: 99}} /> : null}

      {/* The voiceover mp3 is already 240s long (own lead-in silence), so it starts at frame 0 */}
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
