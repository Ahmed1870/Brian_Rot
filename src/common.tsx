import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {C} from './theme';
import {cairo, mono} from './fonts';
import type {Box} from './layout';
import {ZONES} from './layout';

export const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** Largest font size (<= max) at which `text` fits inside `w` px. Guarantees no overflow. */
export const fs = (text: string, w: number, max: number, font = cairo, weight = 700) =>
  Math.min(max, fitText({text, withinWidth: w, fontFamily: font, fontWeight: weight}).fontSize);

/** Shared SVG defs: neon glow + soft shadow. Include once per <svg> that uses them. */
export const Defs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <linearGradient id="cardg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#223047" />
      <stop offset="1" stopColor="#16203A" />
    </linearGradient>
  </defs>
);

/** Scene shell: gradient backdrop, faint grid, accent hairline, soft fade + slide. */
export const Scene: React.FC<{dur: number; accent?: string; children: React.ReactNode}> = ({dur, accent = C.blue, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 14, dur - 10, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(f, [0, 22], [60, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: `radial-gradient(1400px 800px at 50% 35%, #172238 0%, ${C.bg} 60%, ${C.bg2} 100%)`}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 33}, (_, i) => (<line key={'v' + i} x1={i * 60} y1={0} x2={i * 60} y2={1080} stroke={C.line} strokeWidth={1} opacity={0.18} />))}
        {Array.from({length: 19}, (_, i) => (<line key={'h' + i} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke={C.line} strokeWidth={1} opacity={0.18} />))}
        <rect x={0} y={0} width={1920} height={5} fill={accent} opacity={0.9} />
      </svg>
      <AbsoluteFill style={{opacity: o, transform: `translateX(${x}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Title zone: scene chip + English subtitle on the left, Arabic headline on the right. */
export const Title: React.FC<{ar: string; en: string; chip: string; accent?: string}> = ({ar, en, chip, accent = C.blue}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = Math.min(1, spring({frame: f - 4, fps, config: {damping: 16, stiffness: 120}}));
  const z = ZONES.title;
  return (
    <div style={{position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'space-between', left: z.x, top: z.y, width: z.w, height: z.h, opacity: p, transform: `translateY(${(1 - p) * 36}px)`, direction: 'ltr'}}>
      <div style={{width: 760}}>
        <div style={{display: 'inline-block', fontFamily: mono, fontSize: 24, fontWeight: 700, color: C.bg, background: accent, borderRadius: 999, padding: '4px 18px'}}>{chip}</div>
        <div style={{marginTop: 12, fontFamily: mono, fontWeight: 700, color: C.dim, whiteSpace: 'nowrap', fontSize: fs(en, 760, 32, mono)}}>{en}</div>
      </div>
      <div style={{width: 960, textAlign: 'right', direction: 'rtl', fontWeight: 900, color: C.text, lineHeight: 1.2, whiteSpace: 'nowrap', fontSize: fs(ar, 960, 72, cairo, 900)}}>{ar}</div>
    </div>
  );
};

/** Caption zone: lives strictly below the art zone. */
export const Caption: React.FC<{from: number; to: number; color?: string; ltr?: boolean; children: string}> = ({from, to, color = C.text, ltr = true, children}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const o = interpolate(f, [from, from + 14, to - 14, to], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(f, [from, from + 16], [26, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const z = ZONES.caption;
  const font = ltr ? mono : cairo;
  const size = fs(children, z.w - 140, 46, font, 700);
  return (
    <div style={{position: 'absolute', display: 'flex', alignItems: 'center', left: z.x, top: z.y + 14, width: z.w, height: 96, opacity: o, transform: `translateY(${y}px)`, background: 'linear-gradient(90deg, rgba(30,41,59,0.95), rgba(15,23,42,0.6))', borderRadius: 20, borderLeft: `8px solid ${color}`, padding: '0 40px', direction: ltr ? 'ltr' : 'rtl'}}>
      <div style={{fontFamily: font, fontWeight: 700, fontSize: size, color, whiteSpace: 'nowrap'}}>{children}</div>
    </div>
  );
};

/** Card on a layout box. Children are positioned relative to the card. */
export const Card: React.FC<{box: Box; accent?: string; at?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({box, accent = C.line, at = 0, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = Math.min(1, Math.max(0, spring({frame: f - at, fps, config: {damping: 17, stiffness: 120}})));
  return (
    <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, background: 'linear-gradient(160deg, #223047 0%, #16203A 100%)', border: `2px solid ${accent}`, borderRadius: 26, boxShadow: '0 22px 50px rgba(0,0,0,0.5)', opacity: p, transform: `translateY(${(1 - p) * 40}px)`, overflow: 'hidden', ...style}}>
      {children}
    </div>
  );
};

/** Small uppercase label inside cards. */
export const Tag: React.FC<{color: string; children: React.ReactNode}> = ({color, children}) => (
  <span style={{fontFamily: mono, fontSize: 22, fontWeight: 700, color, letterSpacing: 1.5}}>{children}</span>
);
