import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile} from 'remotion';
import {AUDIO_FILE, DURATION, FPS} from './theme';
import {BOUNDS} from './sync';
import {SceneStart} from './lib/anim';
import {Sfx} from './lib/scene41';
import {Scene1, S1_SFX} from './scenes/Scene1';
import {Scene2, S2_SFX} from './scenes/Scene2';
import {Scene3, S3_SFX} from './scenes/Scene3';
import {Scene4, S4_SFX} from './scenes/Scene4';
import {Scene5, S5_SFX} from './scenes/Scene5';
import {Scene6, S6_SFX} from './scenes/Scene6';
import {End, S7_SFX} from './scenes/Scene7';
import interReg from './fonts/Inter-Regular.otf';
import interSemi from './fonts/Inter-SemiBold.otf';
import dejaReg from './fonts/DejaVuSans.ttf';
import dejaBold from './fonts/DejaVuSans-Bold.ttf';
import dejaMono from './fonts/DejaVuSansMono.ttf';

declare global {
  interface FontFaceSet {
    add(font: FontFace): FontFaceSet;
  }
}

// "ov" = ثواني تداخل بعد نهاية المشهد لعمل cross-dissolve (المشهد التالي يُرسم فوقه).
const SCENES: {id: string; C: React.FC; ov: number}[] = [
  {id: 'S1', C: Scene1, ov: 0.5},
  {id: 'S2', C: Scene2, ov: 0},
  {id: 'S3', C: Scene3, ov: 0},
  {id: 'S4', C: Scene4, ov: 0},
  {id: 'S5', C: Scene5, ov: 0.5},
  {id: 'S6', C: Scene6, ov: 0.5},
  {id: 'S7', C: () => <End />, ov: 0},
  {id: 'S8', C: () => <End final />, ov: 0}, // صمت تام: شاشة نهاية ثابتة بلا حركة ولا صوت
];

const SFX: Sfx[] = [...S1_SFX, ...S2_SFX, ...S3_SFX, ...S4_SFX, ...S5_SFX, ...S6_SFX, ...S7_SFX]
  .filter((s) => s.t < BOUNDS[7] - 0.2)
  .sort((a, b) => a.t - b.t);
const SFX_VOL: Record<Sfx['n'], number> = {click: 0.2, pop: 0.16, swish: 0.14, whoosh: 0.14, type: 0.12};

// Cairo يُحمَّل من public/fonts إن وُجد؛ غيابه لا يكسر الرندر (يُستخدم DejaVu المضمّن).
const FACES: [string, string, string][] = [
  ['PBIInter', interReg, '100 500'], ['PBIInter', interSemi, '600 900'],
  ['PBIArabic', dejaReg, '100 500'], ['PBIArabic', dejaBold, '600 900'], ['PBIMono', dejaMono, '100 900'],
  ['Cairo', staticFile('fonts/Cairo-Regular.ttf'), '100 500'], ['Cairo', staticFile('fonts/Cairo-Bold.ttf'), '600 900'],
];

export const Video: React.FC = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      FACES.map(([name, url, weight]) =>
        new FontFace(name, `url(${url})`, {weight}).load().then((ff) => { document.fonts.add(ff); }).catch(() => undefined),
      ),
    ).then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{background: '#FAF9F8'}}>
      <Audio src={staticFile(AUDIO_FILE)} />
      {SCENES.map((s, i) => {
        const from = Math.round(BOUNDS[i] * FPS);
        const end = i === SCENES.length - 1 ? DURATION : Math.round(BOUNDS[i + 1] * FPS);
        const dur = Math.min(DURATION, end + Math.round(s.ov * FPS)) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <SceneStart.Provider value={BOUNDS[i]}>
              <s.C />
            </SceneStart.Provider>
          </Sequence>
        );
      })}
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.t * FPS)} durationInFrames={24} layout="none" name={`sfx-${s.n}`}>
          <Audio src={staticFile(`sfx/${s.n}.wav`)} volume={SFX_VOL[s.n]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
