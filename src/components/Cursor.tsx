import React from 'react';
import {C, FONT_AR} from '../theme';
import {eo, prog} from '../lib/anim';

export const Cursor: React.FC<{x: number; y: number; color?: string; label?: string; scale?: number; press?: number; opacity?: number}> = ({x, y, color = '#fff', label, scale = 1.5, press = 0, opacity = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity, pointerEvents: 'none', zIndex: 60, transform: `scale(${scale * (1 - press * 0.12)})`, transformOrigin: '0 0'}}>
    <svg width="34" height="44" viewBox="0 0 34 44" style={{filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.55))', overflow: 'visible'}}>
      <path d="M2 2 L2 33 L10 26 L16 40 L22 37.5 L16 24 L27 24 Z" fill={color} stroke="#0B1222" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
    {label ? (
      <div style={{position: 'absolute', left: 26, top: 36, background: color, color: '#0B1222', fontFamily: FONT_AR, fontWeight: 800, fontSize: 20, padding: '3px 12px', borderRadius: 8, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(0,0,0,.4)'}}>{label}</div>
    ) : null}
  </div>
);

// expanding click rings
export const Ripples: React.FC<{t: number; x: number; y: number; clicks: number[]; color?: string}> = ({t, x, y, clicks, color = C.accent}) => (
  <>
    {clicks.map((c, i) => {
      const p = prog(t, c, c + 0.55);
      if (p <= 0 || p >= 1) return null;
      const e = eo(p);
      return <div key={i} style={{position: 'absolute', left: x - 36 * e - 6, top: y - 36 * e - 6, width: 72 * e + 12, height: 72 * e + 12, borderRadius: '50%', border: `3px solid ${color}`, opacity: 1 - p, zIndex: 59}} />;
    })}
  </>
);

export const pressAt = (t: number, clicks: number[]): number => {
  let v = 0;
  clicks.forEach((c) => {
    if (t >= c && t < c + 0.16) v = 1;
  });
  return v;
};
