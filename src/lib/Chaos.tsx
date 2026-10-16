import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, CENTER, T} from '../theme';
import {MONO, ORB} from '../fonts';
import {clamp, easeInOut, hash, lerp, ramp} from './anim';

const LABELS = ['DISCOUNTS?', 'RETURNS?', 'LOST PROFIT?', '-37.4%', '#REF!', 'NaN', 'OVERDUE', 'STOCK ERR', '-$18,204', 'CHURN +62%', 'N/A', '404'];
const N = 46;

const BLOCKS = Array.from({length: N}, (_, i) => ({
  x: hash(i * 1.3) * 1160 - 40,
  y: 120 + hash(i * 2.1 + 4) * 1700,
  z: -700 + hash(i * 3.7) * 900,
  rot: (hash(i * 4.4) - 0.5) * 70,
  vr: (hash(i * 5.9) - 0.5) * 2.4,
  sx: 0.03 + hash(i * 6.1) * 0.06,
  ph: hash(i * 7.3) * 6.28,
  kind: i % 4,
  enter: T.s2 + 4 + hash(i * 8.8) * 110,
  label: LABELS[i % LABELS.length],
  tx: CENTER.x + (hash(i * 9.9) - 0.5) * 640,
  ty: CENTER.y + (hash(i * 11.1) - 0.5) * 760,
  d: hash(i * 12.7) * 16,
}));

const red = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: 'linear-gradient(135deg, rgba(255,46,85,0.22), rgba(40,4,14,0.7))',
  border: '2px solid #FF2E55',
  boxShadow: '0 0 22px rgba(255,46,85,0.65), inset 0 0 18px rgba(255,46,85,0.25)',
  borderRadius: 10, ...extra,
});

/** Floating 3D red error blocks. After the shockwave they are pulled magnetically into the dashboard. */
export const Chaos: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.s2 || f > T.s3 + 80) return null;
  return (
    <AbsoluteFill style={{perspective: 1100, perspectiveOrigin: '50% 50%'}}>
      <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d'}}>
        {BLOCKS.map((b, i) => {
          if (f < b.enter) return null;
          const fl = Math.min(1, ramp(f, b.enter, b.enter + 16));
          const storm = 1 + ramp(f, T.s2, T.s3) * 2;
          const px = b.x + Math.sin(f * b.sx + b.ph) * 40 * storm;
          const py = b.y + Math.cos(f * b.sx * 1.3 + b.ph) * 30 * storm;
          const pz = b.z - (1 - fl) * 1800;
          const a = easeInOut(ramp(f, T.s3 + 12 + b.d, T.s3 + 66 + b.d));
          const x = lerp(px, b.tx, a);
          const y = lerp(py, b.ty, a);
          const z = lerp(pz, -200, a);
          const sc = 1 - 0.92 * a;
          const op = fl * (1 - a * a);
          if (op < 0.01) return null;
          const hot = hash(Math.floor(f / 3) + i) > 0.5;
          let el: React.ReactNode;
          if (b.kind === 0) {
            el = <div style={{...red({padding: '10px 22px'}), fontFamily: ORB, fontWeight: 700, fontSize: 34, color: hot ? '#fff' : C.red, whiteSpace: 'nowrap'}}>{b.label}</div>;
          } else if (b.kind === 1) {
            el = (
              <div style={red({width: 250, height: 150, padding: 12})}>
                <div style={{fontFamily: MONO, fontSize: 18, color: C.red}}>REV_Q{(i % 4) + 1}.xlsx</div>
                <svg width={226} height={100} viewBox="0 0 226 100">
                  {Array.from({length: 9}, (_, k) => {
                    const h = 12 + hash(i * 9 + k + Math.floor(f / 4)) * 80;
                    return <rect key={k} x={k * 25} y={100 - h} width={18} height={h} fill={k % 3 === 0 ? '#fff' : C.red} opacity={0.85} />;
                  })}
                </svg>
              </div>
            );
          } else if (b.kind === 2) {
            el = <div style={{width: 96, height: 96, borderRadius: '50%', ...red({borderRadius: 48}), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: ORB, fontWeight: 900, fontSize: 52, color: '#fff'}}>!</div>;
          } else {
            el = <div style={{...red({padding: '8px 20px'}), fontFamily: MONO, fontSize: 40, color: C.red}}>{b.label}</div>;
          }
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, opacity: op,
              transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${b.rot + f * b.vr}deg) rotateY(${Math.sin(f * 0.05 + b.ph) * 40}deg) scale(${sc})`,
              filter: `hue-rotate(${Math.round(190 * a)}deg)`}}>
              {el}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Red glitch bars + stress vignette during the chaos phase. */
export const ChaosFx: React.FC = () => {
  const f = useCurrentFrame();
  if (f < T.s2 || f > T.s3) return null;
  const k = ramp(f, T.s2, T.s3);
  return (
    <>
      <div style={{position: 'absolute', inset: 0, opacity: (0.35 + 0.3 * Math.sin(f / 2.6)) * k,
        background: 'radial-gradient(ellipse at center, rgba(255,46,85,0) 35%, rgba(255,46,85,0.5) 100%)'}} />
      <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: 7}, (_, i) => {
          const on = hash(Math.floor(f / 2) * 7 + i) > 0.82;
          return on ? <rect key={i} x={(hash(f + i) - 0.5) * 80} y={hash(f * 3 + i * 5) * 1920} width={1080} height={4 + hash(i + f) * 26}
            fill={i % 2 ? C.red : C.cyan} opacity={0.18} /> : null;
        })}
        {Array.from({length: 40}, (_, i) => (
          <rect key={i} x={hash(i * 3 + Math.floor(f / 2)) * 1080} y={hash(i * 7 + Math.floor(f / 3)) * 1920} width={6 + hash(i) * 22} height={4}
            fill={i % 3 ? C.red : '#fff'} opacity={0.5 * k} />
        ))}
      </svg>
    </>
  );
};
