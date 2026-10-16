import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CX, CY, eo, flashAt, lerp, ss} from '../engine';
import {Logo} from './Logo';

/** كشف الهوية بعد الانفجار (8.0s) + الفلاش الأبيض. */
export const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const flash = flashAt(t);
  const show = t >= 8.0 && t < 9.9;
  const reveal = eo((t - 8.05) / 0.75);
  const shine = -0.3 + 1.7 * ss(8.6, 9.3, t);
  const out = 1 - ss(9.3, 9.85, t);
  const sc = lerp(0.35, 1, out) * (0.9 + 0.1 * eo((t - 8.05) / 0.5)) * 1.25;
  return (
    <>
      {show && <Logo uid="rv" x={CX} y={CY} scale={sc} reveal={reveal} shine={shine} opacity={Math.min(1, reveal * 3) * out} gold />}
      {flash > 0.003 && (
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(1, flash), background: 'radial-gradient(circle at 50% 48%, #FFFFFF 0%, #FFFFFF 35%, rgba(150,240,255,0.9) 70%, rgba(0,240,255,0.6) 100%)'}} />
      )}
    </>
  );
};
