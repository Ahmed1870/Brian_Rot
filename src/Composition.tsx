import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import './fonts';
import {AudioMix} from './audio';
import {Dashboard} from './components/Dashboard';
import {Resolution} from './components/Resolution';
import {cameraAt} from './camera';
import {C, hash, ss, TIME} from './theme';

const shake = (t: number, f: number) => {
  let a = 0;
  const hit = (t0: number, amp: number, k: number) => {
    if (t >= t0) a += amp * Math.exp(-(t - t0) * k);
  };
  hit(TIME.pull, 24, 6);
  hit(TIME.alarm, 10, 5);
  hit(TIME.lock, 14, 8);
  return {x: (hash(f, 1, 3) - 0.5) * 2 * a, y: (hash(f, 2, 5) - 0.5) * 2 * a};
};

export const BrainRotViral: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cam = cameraAt(f);
  const c = ss(TIME.collapse, 9.9, t);
  const cs = 1 - 0.95 * Math.pow(c, 1.6);
  const worldOp = 1 - ss(9.55, 9.95, t);
  const tilt = ss(6.5, 9.0, t) * (1 - c);
  const sh = shake(t, f);
  const alarm = t > 6.0 && t < 9.5 ? Math.pow(Math.max(0, Math.sin((Math.PI * 2 * (t - 6.0)) / 0.85)), 2) * 0.5 * (1 - ss(8.6, 9.5, t)) + 0.12 * ss(6.0, 6.6, t) * (1 - ss(8.8, 9.5, t)) : 0;

  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, #172036 0%, ${C.bg} 55%, ${C.bgDeep} 100%)`}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {worldOp > 0.01 && (
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, perspective: 2400, perspectiveOrigin: '540px 960px', opacity: worldOp}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 960px', transform: `translate(0px, ${-240 * c}px) rotateY(${-5 * tilt}deg) rotateX(${2.5 * tilt}deg)`}}>
              <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0px 0px', transform: `translate(540px, 960px) scale(${cam.S * cs}) translate(${-cam.x}px, ${-cam.y}px)`}}>
                <Dashboard t={t} />
              </div>
            </div>
          </div>
        )}
        <Resolution t={t} />
      </div>

      {/* حافة حمرا بتنبض مع الإنذار */}
      {alarm > 0.005 && <div style={{position: 'absolute', inset: 0, boxShadow: `inset 0 0 260px rgba(239,68,68,${alarm})`, pointerEvents: 'none'}} />}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none'}} />
      <AudioMix />
    </AbsoluteFill>
  );
};
