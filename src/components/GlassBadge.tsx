import React from 'react';
import {CAIRO} from '../fonts';
import {C} from '../theme';

/** Reusable glassmorphic badge: blurred glass, light border, corner reflection and a slow sheen sweep. */
export const GlassBadge: React.FC<{
  title: string;
  sub?: string;
  subLtr?: boolean;
  icon?: React.ReactNode;
  accent?: string;
  width?: number | string;
  radius?: number;
  titleSize?: number;
  subSize?: number;
  f?: number;
  glow?: number;
  titleColor?: string;
  style?: React.CSSProperties;
}> = ({title, sub, subLtr = false, icon, accent = C.white, width = 'auto', radius = 999, titleSize = 44, subSize = 28, f = 0, glow = 0.35, titleColor = C.white, style}) => (
  <div style={{position: 'relative', width, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 20, direction: 'rtl',
    padding: sub ? '18px 44px' : '14px 44px', borderRadius: radius, overflow: 'hidden',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    border: `2px solid ${accent}`, boxShadow: `0 0 ${46 * glow}px ${accent}66, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 28px rgba(255,255,255,0.05)`, ...style}}>
    {/* corner reflection */}
    <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(115deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0) 26%)', pointerEvents: 'none'}} />
    {/* sheen sweep */}
    <div style={{position: 'absolute', top: -20, bottom: -20, width: 90, left: `${((f * 0.55) % 170) - 40}%`, transform: 'skewX(-22deg)',
      background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))', pointerEvents: 'none'}} />
    {icon}
    <div style={{position: 'relative', textAlign: 'center', fontFamily: CAIRO, lineHeight: 1.25}}>
      <div style={{fontWeight: 900, fontSize: titleSize, color: titleColor}}>{title}</div>
      {sub ? <div style={{fontWeight: 800, fontSize: subSize, color: accent, direction: subLtr ? 'ltr' : 'rtl', letterSpacing: subLtr ? 1.5 : 0, unicodeBidi: 'isolate'}}>{sub}</div> : null}
    </div>
  </div>
);
