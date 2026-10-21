import React from 'react';
import {C, FPS} from '../theme';
import {MATH, MATH_I, MONO, CAIRO} from '../fonts';
import {clamp, easeInOut, easeOut, hash, ramp} from './anim';

/** Shared chalk-roughening filter: apply to a <g> that holds line art. */
export const ChalkDefs: React.FC = () => (
  <defs>
    <filter id="chalk" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

// ---- hand-drawn geometry (deterministic wobble) ---------------------------------
type Pt = [number, number];
const jit = (a: number, seed: number, amp: number) => (hash(a * 12.9 + seed * 78.2) - 0.5) * 2 * amp;
export const wobble = (pts: Pt[], seed = 1, amp = 1.3) => pts.map(([x, y], i) => [x + jit(i, seed, amp), y + jit(i + 99, seed, amp)] as Pt);
const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
export const lineD = (x1: number, y1: number, x2: number, y2: number, seed = 1, amp = 1.2) => {
  const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 45));
  const pts: Pt[] = Array.from({length: n + 1}, (_, i) => [x1 + ((x2 - x1) * i) / n, y1 + ((y2 - y1) * i) / n] as Pt);
  return toPath(wobble(pts, seed, amp).map((p, i) => (i === 0 || i === n ? ([pts[i][0], pts[i][1]] as Pt) : p)));
};
export const polyD = (pts: Pt[], close = false, seed = 1, amp = 1.2) => {
  let d = '';
  for (let i = 0; i < pts.length - (close ? 0 : 1); i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    d += lineD(a[0], a[1], b[0], b[1], seed + i, amp) + ' ';
  }
  return d;
};
export const rectD = (x: number, y: number, w: number, h: number, seed = 1, amp = 1.2) => polyD([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true, seed, amp);
export const circleD = (cx: number, cy: number, r: number, seed = 1, amp = 1.2) => {
  const n = 36;
  const pts: Pt[] = Array.from({length: n + 1}, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * r] as Pt);
  const w = wobble(pts, seed, amp);
  w[n] = w[0];
  return toPath(w);
};
export const arrowD = (x1: number, y1: number, x2: number, y2: number, seed = 1, head = 22) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h1: Pt = [x2 - Math.cos(a - 0.45) * head, y2 - Math.sin(a - 0.45) * head];
  const h2: Pt = [x2 - Math.cos(a + 0.45) * head, y2 - Math.sin(a + 0.45) * head];
  return `${lineD(x1, y1, x2, y2, seed)} ${lineD(h1[0], h1[1], x2, y2, seed + 3, 0.6)} ${lineD(h2[0], h2[1], x2, y2, seed + 5, 0.6)}`;
};
export const curveD = (pts: Pt[]) => {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

// ---- animated chalk primitives ----------------------------------------------------
/** A chalk stroke that draws itself between frames [from, from+dur]. */
export const Stroke: React.FC<{d: string; f: number; from: number; dur?: number; w?: number; color?: string; fill?: string; op?: number; dash?: string}> = ({d, f, from, dur = 24, w = 4, color = C.chalk, fill = 'none', op = 0.95, dash}) => {
  const p = easeInOut(ramp(f, from, from + dur));
  if (p <= 0.001) return null;
  return (
    <>
      {fill !== 'none' ? <path d={d} fill={fill} stroke="none" opacity={p} /> : null}
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op}
        strokeDasharray={dash ? undefined : '1 1'} strokeDashoffset={dash ? undefined : 1 - p} style={dash ? {strokeDasharray: dash, opacity: op * p} : undefined} />
    </>
  );
};

/** Chalk text: typed character by character. mode: 'sans' | 'mono' | 'math'. */
export const Txt: React.FC<{x: number; y: number; text: string; f: number; from: number; size?: number; color?: string; mode?: 'sans' | 'mono' | 'math' | 'mathi'; anchor?: 'start' | 'middle' | 'end'; cps?: number; weight?: number; op?: number; spacing?: number}> = ({
  x, y, text, f, from, size = 44, color = C.chalk, mode = 'sans', anchor = 'start', cps = 1.1, weight = 700, op = 1, spacing = 0,
}) => {
  const n = Math.min(text.length, Math.floor(Math.max(0, f - from) * cps));
  if (f < from) return null;
  const fam = mode === 'mono' ? MONO : mode === 'math' ? MATH : mode === 'mathi' ? MATH_I : CAIRO;
  return (
    <text x={x} y={y} fill={color} fontFamily={fam} fontSize={size} fontWeight={weight} textAnchor={anchor} opacity={op} letterSpacing={spacing} style={{whiteSpace: 'pre'}}>
      {text.slice(0, n)}
    </text>
  );
};

/** Count-up helper. */
export const count = (f: number, from: number, dur: number, to: number) => Math.round(to * easeOut(ramp(f, from, from + dur)));
export const fmtN = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Soft yellow underline / marker that sweeps under a word. */
export const Marker: React.FC<{x: number; y: number; w: number; f: number; from: number; h?: number}> = ({x, y, w, f, from, h = 14}) => {
  const p = easeOut(ramp(f, from, from + 14));
  return p > 0 ? <rect x={x} y={y} width={w * p} height={h} fill={C.yellow} opacity={0.35} rx={3} /> : null;
};

/** Syntax-highlighted code that types itself (keywords in yellow). */
const KW = new Set(['SELECT', 'FROM', 'OVER', 'ORDER', 'BY', 'AS', 'NTILE', 'import', 'as', 'pd', 'qcut', 'VAR', 'RETURN', 'SWITCH', 'TRUE', 'PERCENTILE.INC', 'LOOKUP', 'ALLSELECTED', 'SUM', 'labels', 'rank', 'DESC', 'ASC']);
export const Code: React.FC<{x: number; y: number; lines: string[]; f: number; from: number; size?: number; lh?: number; cps?: number; op?: number}> = ({x, y, lines, f, from, size = 25, lh = 38, cps = 1.5, op = 1}) => {
  let budget = Math.max(0, Math.floor((f - from) * cps));
  if (f < from) return null;
  return (
    <g opacity={op}>
      {lines.map((ln, li) => {
        const toks = ln.match(/[A-Za-z_][\w.]*|\d+|\s+|[^\w\s]/g) ?? [];
        const used = Math.min(ln.length, budget);
        budget = Math.max(0, budget - ln.length - 1);
        let acc = 0;
        return (
          <text key={li} x={x} y={y + li * lh} fontFamily={MONO} fontSize={size} fontWeight={400} style={{whiteSpace: 'pre'}}>
            {toks.map((tk, ti) => {
              const s = Math.max(0, Math.min(tk.length, used - acc));
              acc += tk.length;
              if (s <= 0) return null;
              return <tspan key={ti} fill={KW.has(tk) ? C.yellow : C.chalk} fontWeight={KW.has(tk) ? 700 : 400}>{tk.slice(0, s)}</tspan>;
            })}
          </text>
        );
      })}
    </g>
  );
};

export const sec = (f: number) => f / FPS;

/** Math formula written left->right (clip wipe). parts: sub = subscript, it = italic. */
export const Formula: React.FC<{x: number; y: number; f: number; from: number; size?: number; parts: {t: string; sub?: boolean; it?: boolean; color?: string}[]; dur?: number; id: string; anchor?: 'start' | 'middle'; width?: number}> = ({
  x, y, f, from, size = 60, parts, dur = 40, id, anchor = 'start', width = 1100,
}) => {
  const p = easeOut(ramp(f, from, from + dur));
  if (p <= 0) return null;
  const x0 = anchor === 'middle' ? x - width / 2 : x;
  return (
    <g>
      <clipPath id={id}><rect x={x0 - 10} y={y - size * 1.2} width={(width + 20) * p} height={size * 2} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <text x={x} y={y} fontSize={size} fill={C.chalk} textAnchor={anchor} style={{whiteSpace: 'pre'}}>
          {parts.map((pt, i) => (
            <tspan key={i} fontFamily={pt.it ? MATH_I : MATH} fontSize={pt.sub ? size * 0.58 : size} dy={pt.sub ? size * 0.2 : i > 0 && parts[i - 1].sub ? -size * 0.2 : 0} fill={pt.color ?? C.chalk}>{pt.t}</tspan>
          ))}
        </text>
      </g>
    </g>
  );
};
