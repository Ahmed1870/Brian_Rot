import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T2, T4} from '../camera';
import {C, clamp} from '../theme';

/** فلاشات الصدمات + Vignette + خطوط مسح خفيفة. */
export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const fl = (t0: number, a: number, k: number) => (t >= t0 ? a * Math.exp(-(t - t0) * k) : 0);
  const white = Math.max(fl(0.2, 0.85, 14), fl(T2, 0.25, 12), fl(T4 + 0.05, 0.45, 12));
  const yellow = fl(30.0, 0.55, 9);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)', pointerEvents: 'none'}} />
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)', pointerEvents: 'none'}} />
      {white > 0.01 && <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: clamp(white)}} />}
      {yellow > 0.01 && <div style={{position: 'absolute', inset: 0, background: C.yellow, opacity: clamp(yellow), mixBlendMode: 'screen'}} />}
    </>
  );
};
