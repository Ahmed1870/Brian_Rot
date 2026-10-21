import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import './fonts';
import TL from './timeline.json';
import {AudioMix} from './audio';
import {ChalkDefs} from './components/Chalk';
import {Eraser, eraseClip} from './components/Eraser';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';

const E = TL.erase;
const ERASE_END = 0.95;

type SceneDef = {from: number; until: number; erase: number | null; C: React.FC<{t: number}>};
const SCENES: SceneDef[] = [
  {from: 0, until: E[0] + ERASE_END, erase: E[0], C: Scene1},
  {from: E[0], until: E[1] + ERASE_END, erase: E[1], C: Scene2},
  {from: E[1], until: E[2] + ERASE_END, erase: E[2], C: Scene3},
  {from: E[2], until: E[3] + ERASE_END, erase: E[3], C: Scene4},
  {from: E[3], until: 999, erase: null, C: Scene5},
];

export const BrainRotViral: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  return (
    <AbsoluteFill style={{background: '#1E2226'}}>
      <ChalkDefs />
      <Img src={staticFile('board.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}} />
      {SCENES.map(({from, until, erase, C}, i) => {
        if (t < from || t >= until) return null;
        const clip = erase !== null ? eraseClip(t, erase) : undefined;
        return (
          <div key={i} style={{position: 'absolute', inset: 0, clipPath: clip}}>
            <div style={{position: 'absolute', inset: 0, filter: 'url(#chalk)'}}>
              <C t={t} />
            </div>
          </div>
        );
      })}
      {E.map((e, i) => (
        <Eraser key={i} t={t} e={e} />
      ))}
      <AudioMix />
    </AbsoluteFill>
  );
};
