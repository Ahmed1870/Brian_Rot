import React from 'react';
import {CAIRO} from '../fonts';
import {C} from '../theme';

/** Glassmorphic badge: blurred glass, light border, corner reflection, sheen sweep. */
export const GlassBadge: React.FC<{
  title: string; sub?: string; subLtr?: boolean; icon?: React.ReactNode; accent?: string; width?: number | string; radius?: number;
  titleSize?: number; subSize?: number; f?: number; titleColor?: string; style?: React.CSSProperties;
}> = ({title, sub, subLtr = false, icon, accent = C.text, width = 'auto', radius = 999, titleSize = 44, subSize = 28, f = 0, titleColor = C.text, style}) => (
  <div style={{position: 'relative', width, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 20, direction: 'rtl', padding: sub ? '16px 40px' : '12px 40px',
    borderRadius: radius, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(248,250,252,0.16), rgba(248,250,252,0.04))', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    border: `2px solid ${accent}`, boxShadow: `0 0 34px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.45)`, ...style}}>
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0) 26%)', pointerEvents: 'none'}} />
    <div style={{position: 'absolute', top: -20, bottom: -20, width: 90, left: `${((f * 0.55) % 170) - 40}%`, transform: 'skewX(-22deg)',
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))', pointerEvents: 'none'}} />
    {icon}
    <div style={{position: 'relative', textAlign: 'center', fontFamily: CAIRO, lineHeight: 1.25}}>
      <div style={{fontWeight: 900, fontSize: titleSize, color: titleColor}}>{title}</div>
      {sub ? <div style={{fontWeight: 700, fontSize: subSize, color: accent, direction: subLtr ? 'ltr' : 'rtl', letterSpacing: subLtr ? 1.2 : 0, unicodeBidi: 'isolate'}}>{sub}</div> : null}
    </div>
  </div>
);
