import React from 'react';
import {useCurrentFrame} from 'remotion';
import {MONO} from '../fonts';
import {C, hash, ss} from '../theme';

const BANDS = 9;

/** Glitch سينمائي سريع: RAW DATA NOISE (6.0 → 7.7). */
export const Glitch: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const k = ss(5.95, 6.3, t) * (1 - ss(7.35, 7.75, t));
  if (k <= 0.01) return null;
  const base: React.CSSProperties = {position: 'absolute', left: 0, width: 1080, top: 760, textAlign: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 168, lineHeight: 1.0, whiteSpace: 'pre', direction: 'ltr'};
  const text = 'RAW DATA\nNOISE';
  return (
    <div style={{position: 'absolute', inset: 0, opacity: k}}>
      {new Array(BANDS).fill(0).map((_, i) => {
        const top = (i / BANDS) * 100;
        const bottom = 100 - ((i + 1) / BANDS) * 100;
        const off = (hash(f, i, 1) - 0.5) * 140 * (hash(f, i, 9) > 0.45 ? 1 : 0.15);
        return (
          <div key={i} style={{position: 'absolute', inset: 0, clipPath: `inset(${top}% 0 ${bottom}% 0)`, transform: `translateX(${off}px)`}}>
            <div style={{...base, color: C.cyan, transform: 'translateX(-9px)', mixBlendMode: 'screen'}}>{text}</div>
            <div style={{...base, color: C.yellow, transform: 'translateX(9px)', mixBlendMode: 'screen'}}>{text}</div>
            <div style={{...base, color: C.white}}>{text}</div>
          </div>
        );
      })}
      {new Array(7).fill(0).map((_, i) => {
        if (hash(f, i, 4) < 0.5) return null;
        return <div key={i} style={{position: 'absolute', left: 0, width: 1080, top: hash(f, i, 5) * 1840, height: 14 + hash(f, i, 6) * 70, background: '#fff', mixBlendMode: 'difference'}} />;
      })}
    </div>
  );
};
