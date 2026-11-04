import React from 'react';
import {C} from '../theme';
import {prog} from '../lib/anim';

type Ch = {children?: React.ReactNode};

// Glassmorphism without backdrop-filter (too expensive to render): gradient + border + inner highlight + moving sheen.
export const Glass: React.FC<Ch & {x?: number; y?: number; w: number; h: number; r?: number; tint?: string; glow?: number; t?: number; sheen?: boolean; style?: React.CSSProperties; fill?: string}> = ({children, x, y, w, h, r = 28, tint = C.accent, glow = 0, t = 0, sheen = true, style, fill}) => {
  const sp = prog((t * 0.17) % 1, 0, 1);
  return (
    <div
      style={{
        position: x === undefined ? 'relative' : 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: r,
        background: fill || `linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.035) 55%, rgba(255,255,255,0.07) 100%), rgba(30,41,59,0.78)`,
        border: '1.5px solid rgba(255,255,255,0.15)',
        boxShadow: `0 30px 80px rgba(0,0,0,0.45), inset 0 1.5px 0 rgba(255,255,255,0.14), 0 0 ${glow}px ${tint}`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {sheen ? <div style={{position: 'absolute', top: -h * 0.4, bottom: -h * 0.4, width: w * 0.18, left: `${-30 + sp * 160}%`, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)', pointerEvents: 'none'}} /> : null}
      {children}
    </div>
  );
};

export const Bg: React.FC<{t: number; tint?: string; dim?: number}> = ({t, tint = C.accent, dim = 1}) => {
  const dx = Math.sin(t * 0.12) * 80;
  const dy = Math.cos(t * 0.09) * 50;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 260 + dx, top: -240 + dy, width: 1100, height: 1100, borderRadius: '50%', background: `radial-gradient(circle, ${tint}2E 0%, transparent 62%)`, opacity: dim}} />
      <div style={{position: 'absolute', left: 1000 - dx, top: 420 - dy, width: 1100, height: 900, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 62%)', opacity: dim}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.5 * dim}}>
        <defs>
          <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="#475569" opacity="0.55" />
          </pattern>
          <radialGradient id="vig" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#dots)" />
        <rect width="1920" height="1080" fill="url(#vig)" />
      </svg>
    </div>
  );
};
