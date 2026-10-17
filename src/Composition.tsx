import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import './fonts';
import {AudioMix} from './audio';
import {World} from './components/World';
import {Glitch} from './components/Glitch';
import {Overlay} from './components/Overlay';
import {R, scaleOf, shakeAt} from './camera';
import {ss} from './theme';
import {World1} from './worlds/World1';
import {World2} from './worlds/World2';
import {World3} from './worlds/World3';
import {World4} from './worlds/World4';

const CULL_BIG = R * 0.985; // الثقب بيغطي الشاشة كلها عند E ≈ 27.5
const CULL_SMALL = 0.006;

/** لقطة واحدة متصلة: 4 عوالم متداخلة (الأعمق تحت) + Micro Shakes + Glitch + فلاشات. */
export const BrainRotViral: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const sh = shakeAt(t, f);
  const E = [1, 2, 3, 4].map((k) => scaleOf(k, t));
  const collapse = ss(34.8, 35.0, t); // آخر 5 فريمات: الأيقونة بتنكمش لنقطة سودا → لوب على الفريم 0 (أسود)
  const e4 = E[3] * (1 - 0.985 * collapse);

  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {e4 > CULL_SMALL && collapse < 1 && (
          <World scale={e4} hole={false}>
            <div style={{opacity: 1 - collapse}}>
              <World4 />
            </div>
          </World>
        )}
        {E[2] > CULL_SMALL && E[2] < CULL_BIG && (
          <World scale={E[2]}>
            <World3 />
          </World>
        )}
        {E[1] > CULL_SMALL && E[1] < CULL_BIG && (
          <World scale={E[1]}>
            <World2 />
          </World>
        )}
        {E[0] < CULL_BIG && (
          <World scale={E[0]}>
            <World1 />
          </World>
        )}
      </div>
      <Glitch />
      <Overlay />
      <AudioMix />
    </AbsoluteFill>
  );
};
