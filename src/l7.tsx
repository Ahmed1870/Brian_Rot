// Lesson 07 helpers: cell geometry in logical Excel px, neon cell frames, text-number triangle, counters, cards.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from './theme';
import {XL, colWidth, colX, geo, Mix, clamp, prog} from './kit';

export type Geom = {ribbon?: number; fbExp?: number; fbLines?: number; scroll?: {r: number; c: number}; colW?: (c: number) => number; rowW?: number};
export type Rect = {x: number; y: number; w: number; h: number};

export const cellRect = (r: number, c: number, o: Geom = {}): Rect => {
  const cw = o.colW ?? colWidth;
  const sc = o.scroll ?? {r: 1, c: 1};
  const gm = geo(o.ribbon ?? 1, o.fbExp ?? 0, o.fbLines ?? 1, o.rowW ?? 38);
  return {x: gm.rowW + colX(c, sc.c, cw), y: gm.rowsTop + (r - sc.r) * XL.rowH, w: cw(c), h: XL.rowH};
};
export const rangeRect = (r1: number, c1: number, r2: number, c2: number, o: Geom = {}): Rect => {
  const a = cellRect(r1, c1, o), b = cellRect(r2, c2, o);
  return {x: a.x, y: a.y, w: b.x + b.w - a.x, h: b.y + b.h - a.y};
};
export const center = (r: Rect) => ({x: r.x + r.w / 2, y: r.y + r.h / 2});

/** Neon frame around a rectangle in logical Excel coordinates (optionally dashed/marching, tinted, labelled). */
export const RangeFx: React.FC<{rect: Rect; color: string; p: number; fill?: number; dashed?: boolean; label?: string; labelBelow?: boolean; labelDx?: number; width?: number}> = ({rect, color, p, fill = 0.14, dashed, label, labelBelow, labelDx, width = 2.5}) => {
  const f = useCurrentFrame();
  if (p <= 0.001) return null;
  const pulse = 0.7 + 0.3 * Math.sin(f * 0.14);
  return (
    <div style={{position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: 18, pointerEvents: 'none', opacity: clamp(p)}}>
      <svg width={rect.w} height={rect.h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: `drop-shadow(0 0 ${7 * pulse}px ${color})`}}>
        <rect x={1} y={1} width={Math.max(1, rect.w - 2)} height={Math.max(1, rect.h - 2)} fill={color} fillOpacity={fill} stroke={color} strokeWidth={width} strokeDasharray={dashed ? '7 5' : undefined} strokeDashoffset={dashed ? -f * 0.9 : 0} />
      </svg>
      {label ? (
        <div style={{position: 'absolute', left: labelDx ?? 0, [labelBelow ? 'bottom' : 'top']: labelDx !== undefined ? 3 : -2, transform: labelDx !== undefined ? 'none' : `translateY(${labelBelow ? '100%' : '-100%'})`, background: color, color: '#0B1222', fontFamily: MONO, fontSize: 12, fontWeight: 700, padding: '1px 8px', borderRadius: 4, whiteSpace: 'nowrap'}}>{label}</div>
      ) : null}
    </div>
  );
};

/** Green error-indicator triangle in the top-left corner of a cell (number stored as text). */
export const Tri: React.FC<{rect: Rect; p?: number}> = ({rect, p = 1}) => (
  <svg style={{position: 'absolute', left: rect.x + 1, top: rect.y + 1, zIndex: 17, opacity: clamp(p)}} width={7} height={7}><path d="M0 0H7L0 7Z" fill="#107C41" /></svg>
);

/** Error-checking smart tag (generic yellow diamond with "!") drawn to the left of the active cell. */
export const SmartTag: React.FC<{rect: Rect; p?: number; open?: boolean}> = ({rect, p = 1, open}) => (
  <div style={{position: 'absolute', left: rect.x - 30, top: rect.y + 2, width: 28, height: 18, zIndex: 25, opacity: clamp(p), display: 'flex', alignItems: 'center', gap: 1}}>
    <svg width={18} height={18} viewBox="0 0 18 18"><path d="M9 1 L17 9 L9 17 L1 9 Z" fill="#F4C20D" stroke="#B58A00" strokeWidth={1} /><rect x={8.1} y={4.5} width={1.8} height={6} fill="#4A3A00" /><rect x={8.1} y={11.8} width={1.8} height={1.8} fill="#4A3A00" /></svg>
    <svg width={8} height={18} viewBox="0 0 8 18"><path d="M1 7 L4 11 L7 7" fill="none" stroke={open ? '#107C41' : '#555'} strokeWidth={1.4} /></svg>
  </div>
);

export const typeIn = (text: string, f: number, start: number, dur: number) => text.slice(0, Math.floor(clamp((f - start) / dur) * text.length + 0.0001));
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp(x), 3);
/** Counter roll between two values. */
export const roll = (a: number, b: number, f: number, start: number, dur: number) => a + (b - a) * easeOut((f - start) / dur);

/** Screen-space result card (counter + formula). */
export const KpiCard: React.FC<{x: number; y: number; w?: number; h?: number; title: string; sub?: string; value: string; formula: string; color: string; p: number; glow?: number; badge?: string}> = ({x, y, w = 390, h = 200, title, sub, value, formula, color, p, glow = 0, badge}) => {
  if (p <= 0.001) return null;
  const s = 0.86 + 0.14 * clamp(p);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: clamp(p), transform: `scale(${s})`, transformOrigin: '50% 50%', borderRadius: 22, background: 'linear-gradient(160deg, rgba(30,41,59,0.96), rgba(15,23,42,0.96))', border: `2px solid ${color}`, boxShadow: `0 20px 60px rgba(2,6,23,.7), 0 0 ${10 + 36 * glow}px ${color}${glow > 0.05 ? '99' : '44'}`, padding: '20px 26px', boxSizing: 'border-box'}}>
      <div dir="ltr" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color}}>{title}</div>
        {badge ? <div style={{fontFamily: MONO, fontSize: 16, fontWeight: 700, color: '#0B1222', background: color, borderRadius: 999, padding: '2px 12px'}}>{badge}</div> : null}
      </div>
      {sub ? <Mix style={{fontSize: 22, color: C.muted, display: 'block', marginTop: 4}}>{sub}</Mix> : null}
      <div dir="ltr" style={{fontFamily: MONO, fontSize: value.length > 9 ? 46 : 58, fontWeight: 700, color: C.text, marginTop: sub ? 6 : 18, letterSpacing: -1}}>{value}</div>
      <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted, position: 'absolute', left: 26, bottom: 16}}>{formula}</div>
    </div>
  );
};

/** Pill with a function name. */
export const FnPill: React.FC<{name: string; color: string; p: number; big?: boolean}> = ({name, color, p, big}) => (
  <div style={{opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 18}px) scale(${0.85 + 0.15 * clamp(p)})`, border: `3px solid ${color}`, borderRadius: 999, padding: big ? '12px 40px' : '8px 28px', fontFamily: MONO, fontWeight: 700, fontSize: big ? 44 : 36, color: C.text, background: `${color}22`, boxShadow: `0 0 28px ${color}55`}}>
    <span style={{color}}>{name}</span><span style={{color: C.muted}}>( )</span>
  </div>
);

export const px = (n: number) => `${n}px`;
export {prog};

import type {Cam} from './kit';
export const CAM_SHEET: Cam = {fx: 590, fy: 420, z: 1.3};
export const CAM_ZOOM_C: Cam = {fx: 300, fy: 400, z: 2.1};
export const stat3 = (avg: string, count: string, sum: string): Array<[string, string]> => [['Average', avg], ['Count', count], ['Sum', sum]];
