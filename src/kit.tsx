import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, LESSON, MONO, SCENES, TOTAL_FRAMES} from './theme';

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const sec = (s: number) => Math.round(s * FPS);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Eased 0..1 progress from `start` (frames) lasting `dur` frames. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Springy 0..~1 pop-in starting at `start`. */
export const pop = (frame: number, start: number) =>
  frame < start ? 0 : spring({frame: frame - start, fps: FPS, config: {damping: 13, stiffness: 150, mass: 0.7}});

/** Typed text: how many characters are visible. */
export const typed = (text: string, frame: number, start: number, cps = 1.4) =>
  text.slice(0, Math.floor(clamp((frame - start) * cps, 0, text.length)));

/* ---------------------------------------------------------------- global layers */

/** Dark slate backdrop with a slowly drifting dot grid. */
export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const o = (f * 0.2) % 48;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o})`}>
            <circle cx="2" cy="2" r="1.6" fill="#94A3B8" fillOpacity="0.16" />
          </pattern>
        </defs>
        <rect width="1920" height="1080" fill="url(#dots)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(15,23,42,0) 55%, rgba(2,6,23,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Persistent chrome: course chip, scene dots, overall progress bar. */
export const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const starts = Object.values(SCENES).map((s) => s.from);
  const active = starts.filter((s) => f >= s).length - 1;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 56, top: 26, fontFamily: MONO, fontSize: 22, color: C.muted, letterSpacing: 0.5}}>
        <span style={{color: C.blue}}>SQL</span> From Zero to Professional · <span style={{color: C.text}}>Lesson {LESSON}</span>
      </div>
      <div style={{position: 'absolute', right: 56, top: 32, display: 'flex', gap: 10}}>
        {starts.map((_, i) => (
          <div key={i} style={{width: i === active ? 34 : 12, height: 12, borderRadius: 6, background: i === active ? C.green : i < active ? C.blue : C.border, opacity: i <= active ? 1 : 0.7}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 6, background: '#0B1222'}}>
        <div style={{width: `${(f / TOTAL_FRAMES) * 100}%`, height: 6, background: `linear-gradient(90deg, ${C.blue}, ${C.green})`}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- scene stage + transitions */

export type InFx = 'none' | 'zoom' | 'left' | 'morph' | 'up' | 'fade';
export type OutFx = 'none' | 'zoom' | 'left' | 'morph' | 'up' | 'down' | 'fade' | 'black';

const N = 18;

/** Wraps a scene and applies its 2D enter / exit transition. */
export const Stage: React.FC<{dur: number; inFx?: InFx; outFx?: OutFx; children: React.ReactNode}> = ({dur, inFx = 'fade', outFx = 'fade', children}) => {
  const f = useCurrentFrame();
  const pi = inFx === 'none' ? 1 : prog(f, 0, N);
  const outLen = outFx === 'black' ? 24 : N;
  const po = outFx === 'none' ? 0 : prog(f, dur - outLen, outLen);
  const a = 1 - pi;
  let x = 0;
  let y = 0;
  let s = 1;
  if (inFx === 'zoom') s *= 0.92 + 0.08 * pi;
  if (inFx === 'left') x += 160 * a;
  if (inFx === 'morph') s *= 1.05 - 0.05 * pi;
  if (inFx === 'up') y += 90 * a;
  if (outFx === 'zoom') s *= 1 + 0.12 * po;
  if (outFx === 'left') x -= 160 * po;
  if (outFx === 'morph') s *= 1 - 0.04 * po;
  if (outFx === 'up') y -= 90 * po;
  if (outFx === 'down') y += 90 * po;
  return (
    <AbsoluteFill style={{opacity: pi * (1 - po), transform: `translate(${x}px, ${y}px) scale(${s})`, fontFamily: FONT}}>{children}</AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- UI building blocks */

/** Bidi-safe text: Arabic and Latin mix in one line. */
export const Mix: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span dir="auto" style={{unicodeBidi: 'plaintext', fontFamily: FONT, ...style}}>{children}</span>
);

/** Top badge (pops in, fades out). */
export const TopBadge: React.FC<{text: string; from: number; to: number; color?: string}> = ({text, from, to, color = C.blue}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 12) return null;
  const p = pop(f, from);
  const o = 1 - prog(f, to, 12);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{transform: `scale(${0.85 + 0.15 * p})`, background: C.card, border: `2px solid ${color}`, borderRadius: 999, padding: '14px 40px', boxShadow: `0 0 0 6px ${color}22`}}>
        <Mix style={{fontSize: 40, fontWeight: 700, color: C.text}}>{text}</Mix>
      </div>
    </div>
  );
};

/** Bottom on-screen typography line: types in, then fades out. Arrow segments are amber. */
export const Caption: React.FC<{text: string; from: number; to: number; tone?: 'normal' | 'danger' | 'ok'}> = ({text, from, to, tone = 'normal'}) => {
  const edge = tone === 'danger' ? C.red : tone === 'ok' ? C.green : C.border;
  const f = useCurrentFrame();
  if (f < from || f > to + 12) return null;
  const shown = typed(text, f, from, 1.6);
  const parts = shown.split(/(──\[[^\]]*\]──►|──►)/);
  const o = 1 - prog(f, to, 12);
  const blink = Math.floor(f / 12) % 2 === 0 ? 1 : 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 940, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div dir="ltr" style={{fontFamily: MONO, fontSize: 34, color: C.text, background: C.card, border: `2px solid ${edge}`, borderRadius: 16, padding: '16px 34px', whiteSpace: 'pre', minHeight: 44, boxShadow: tone === 'normal' ? 'none' : `0 0 0 6px ${edge}22`}}>
        {parts.map((p, i) => (
          <span key={i} style={{color: /^──/.test(p) ? C.amber : C.text}}>{p}</span>
        ))}
        <span style={{opacity: blink, color: C.green}}>▌</span>
      </div>
    </div>
  );
};

/** Window chrome (title bar + content area that starts below the bar). */
export const Win: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  accent?: string;
  opacity?: number;
  scale?: number;
  children?: React.ReactNode;
}> = ({x, y, w, h, title, accent = C.border, opacity = 1, scale = 1, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 22,
      background: C.card,
      border: `2px solid ${accent}`,
      boxShadow: '0 26px 70px rgba(2,6,23,0.55)',
      overflow: 'hidden',
      opacity,
      transform: `scale(${scale})`,
      transformOrigin: '50% 50%',
    }}
  >
    <div style={{height: 56, background: C.deep, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 22px', gap: 10}}>
      <div style={{width: 14, height: 14, borderRadius: 7, background: C.red}} />
      <div style={{width: 14, height: 14, borderRadius: 7, background: C.amber}} />
      <div style={{width: 14, height: 14, borderRadius: 7, background: C.green}} />
      <div dir="ltr" style={{marginLeft: 16, fontFamily: MONO, fontSize: 21, color: C.muted}}>{title}</div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 56, bottom: 0}}>{children}</div>
  </div>
);

/** Small rounded chip. */
export const Chip: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.blue, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, border: `2px solid ${color}`, color, borderRadius: 999, padding: '6px 18px', fontFamily: MONO, fontSize: 24, fontWeight: 700, background: `${color}18`, ...style}}>{children}</div>
);

/** Reusable check mark that pops in. */
export const Check: React.FC<{size?: number; color?: string; p: number}> = ({size = 44, color = C.green, p}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={{transform: `scale(${p})`, opacity: clamp(p)}}>
    <circle cx={22} cy={22} r={20} fill={`${color}22`} stroke={color} strokeWidth={3} />
    <polyline points="12,23 19,30 33,14" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Warning triangle. */
export const Warn: React.FC<{size?: number; color?: string}> = ({size = 64, color = C.red}) => (
  <svg width={size} height={size * 0.92} viewBox="0 0 70 64">
    <path d="M35 4 L66 58 H4 Z" fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <line x1={35} y1={24} x2={35} y2={40} stroke={color} strokeWidth={6} strokeLinecap="round" />
    <circle cx={35} cy={50} r={3.5} fill={color} />
  </svg>
);

/* ---------------------------------------------------------------- SQL helpers */
const KW = /(\b(?:SELECT|FROM|WHERE|LIKE|ILIKE|IN|NOT|AND|OR|IS|NULL|AS|CREATE|INDEX|ON|TABLE|JOIN|INNER|LEFT|GROUP|BY|ORDER|HAVING|LIMIT|CASE|WHEN|THEN|ELSE|END|COUNT|SUM|AVG|MAX|MIN|LOWER|UPPER|INITCAP|REGEXP_MATCH|DISTINCT|VALUES|INSERT|INTO|UPDATE|SET|DELETE|RETURNING|EXPLAIN|ANALYZE|SEQUENCE|SCAN|USING|FILTER)\b|'[^']*'|\b\d+(?:\.\d+)?\b|~\*?)/;
const KWONLY = /^(SELECT|FROM|WHERE|LIKE|ILIKE|IN|NOT|AND|OR|IS|NULL|AS|CREATE|INDEX|ON|TABLE|JOIN|INNER|LEFT|GROUP|BY|ORDER|HAVING|LIMIT|CASE|WHEN|THEN|ELSE|END|COUNT|SUM|AVG|MAX|MIN|LOWER|UPPER|INITCAP|REGEXP_MATCH|DISTINCT|VALUES|INSERT|INTO|UPDATE|SET|DELETE|RETURNING|EXPLAIN|ANALYZE|SEQUENCE|SCAN|USING|FILTER)$/;

/** One SQL line with simple syntax colouring. */
export const Sql: React.FC<{text: string; strike?: boolean; dim?: boolean}> = ({text, strike, dim}) => (
  <span style={{textDecoration: strike ? 'line-through' : 'none', opacity: dim ? 0.45 : 1}}>
    {text.split(KW).map((p, i) => {
      let color: string = C.text;
      let w = 400;
      if (KWONLY.test(p)) {
        color = C.blue;
        w = 700;
      } else if (p.startsWith("'")) color = C.amber;
      else if (/^\d/.test(p)) color = C.green;
      else if (p === '~' || p === '~*') color = C.amber;
      return (
        <span key={i} style={{color, fontWeight: w}}>
          {p}
        </span>
      );
    })}
  </span>
);

/** Code editor window: types the lines one after another. */
export const Editor: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  lines: string[];
  start: number;
  cps?: number;
  size?: number;
  accent?: string;
  opacity?: number;
  hl?: number;
  hlColor?: string;
  strikeLine?: number;
  dim?: boolean;
}> = ({x, y, w, h, title = 'Query Editor', lines, start, cps = 1.2, size = 28, accent = C.border, opacity = 1, hl = -1, hlColor = C.blue, strikeLine = -1, dim = false}) => {
  const f = useCurrentFrame();
  const full = lines.join('\n');
  const vis = typed(full, f, start, cps).split('\n');
  const done = vis.join('\n').length >= full.length;
  const blink = Math.floor(f / 12) % 2 === 0;
  return (
    <Win x={x} y={y} w={w} h={h} title={title} accent={accent} opacity={opacity}>
      <div dir="ltr" style={{position: 'absolute', inset: 0, background: C.deep, padding: '18px 22px', fontFamily: MONO, fontSize: size, opacity: dim ? 0.55 : 1}}>
        {lines.map((l, i) => {
          const v = vis[i] ?? '';
          const isLast = i === vis.length - 1;
          return (
            <div key={i} style={{display: 'flex', minHeight: size * 1.6, alignItems: 'center', background: hl === i ? `${hlColor}22` : 'transparent', borderRadius: 8}}>
              <span style={{color: '#475569', width: 40, flexShrink: 0}}>{i + 1}</span>
              <span style={{whiteSpace: 'pre'}}>
                <Sql text={v} strike={strikeLine === i} />
                {isLast && !done && blink ? <span style={{color: C.green}}>▌</span> : null}
              </span>
            </div>
          );
        })}
      </div>
    </Win>
  );
};

/** KPI result card: mono label + Arabic label + big value. */
export const Kpi: React.FC<{x: number; y: number; w?: number; h?: number; label: string; ar: string; value: string; color: string; p?: number; glow?: number}> = ({x, y, w = 500, h = 84, label, ar, value, color, p = 1, glow = 0}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 18,
      background: C.card,
      border: `2px solid ${glow > 0.01 ? color : C.border}`,
      boxShadow: glow > 0.01 ? `0 0 ${30 * glow}px ${color}66` : 'none',
      opacity: clamp(p),
      transform: `translateX(${(1 - clamp(p)) * 40}px)`,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
    }}
  >
    <div style={{width: 10, alignSelf: 'stretch', background: color}} />
    <div dir="ltr" style={{flex: 1, padding: '0 18px'}}>
      <div style={{fontFamily: MONO, fontSize: 21, color: C.muted}}>{label}</div>
      <Mix style={{fontSize: 20, color, display: 'block'}}>{ar}</Mix>
    </div>
    <div dir="ltr" style={{fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.text, padding: '0 24px'}}>{value}</div>
  </div>
);

/** Animated draw-on line (pathLength trick). */
export const Draw: React.FC<{d: string; p: number; color: string; width?: number; opacity?: number; dash?: string}> = ({d, p, color, width = 3, opacity = 1, dash}) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity} {...(dash ? {strokeDasharray: dash} : {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - clamp(p)})} />
);

/* ---------------------------------------------------------------- Lesson 26 specific helpers */

export const lin = (f: number, start: number, dur: number) => clamp((f - start) / dur);

/**
 * Render a string with per-character coloring. Each char gets a color based on
 * whether it should currently be in lowercase/uppercase/title state.
 * Used to visualize the case-normalization gate effect on a flowing string.
 */
export const CaseString: React.FC<{
  text: string;
  // null = raw, 'lower' | 'upper' | 'initcap' = transform applied
  mode: 'raw' | 'lower' | 'upper' | 'initcap';
  // for the animated gate: which character index has been "processed"
  progress: number; // 0..text.length
  color: string;
  baseColor?: string;
  size?: number;
  x: number;
  y: number;
}> = ({text, mode, progress, color, baseColor = C.muted, size = 32, x, y}) => {
  const transform = (ch: string, idx: number): string => {
    if (idx >= progress) return ch; // not yet processed
    if (mode === 'lower') return ch.toLowerCase();
    if (mode === 'upper') return ch.toUpperCase();
    if (mode === 'initcap') {
      // first letter of each word segment capitalized, rest lower
      const prev = idx > 0 ? text[idx - 1] : ' ';
      const isWordStart = /[^a-zA-Z]/.test(prev) || idx === 0;
      return isWordStart ? ch.toUpperCase() : ch.toLowerCase();
    }
    return ch;
  };
  return (
    <div dir="ltr" style={{position: 'absolute', left: x, top: y, fontFamily: MONO, fontSize: size, fontWeight: 700, letterSpacing: 1, whiteSpace: 'pre'}}>
      {text.split('').map((ch, i) => {
        const processed = i < progress;
        return (
          <span key={i} style={{color: processed ? color : baseColor, transition: 'none', textShadow: processed ? `0 0 8px ${color}88` : 'none'}}>
            {transform(ch, i)}
          </span>
        );
      })}
    </div>
  );
};

/** A vertical "laser gate" — a glowing vertical bar that the text passes through. */
export const Gate: React.FC<{x: number; y: number; h: number; color: string; label: string; p: number; active: boolean}> = ({x, y, h, color, label, p, active}) => (
  <>
    <div style={{position: 'absolute', left: x - 3, top: y, width: 6, height: h, background: color, opacity: clamp(p) * (active ? 1 : 0.5), boxShadow: `0 0 ${active ? 28 : 14}px ${color}`}} />
    <div style={{position: 'absolute', left: x - 80, top: y - 38, width: 160, textAlign: 'center', opacity: clamp(p)}}>
      <div dir="ltr" style={{fontFamily: MONO, fontSize: 22, fontWeight: 700, color}}>{label}</div>
    </div>
    <div style={{position: 'absolute', left: x - 80, top: y + h + 8, width: 160, textAlign: 'center', opacity: clamp(p) * (active ? 1 : 0.4)}}>
      <div dir="ltr" style={{fontFamily: MONO, fontSize: 18, color: C.muted}}>{active ? '◆ active' : '◆ idle'}</div>
    </div>
  </>
);

/** Email string card used in the regex mesh filter (Scene 3). */
export const EmailChip: React.FC<{x: number; y: number; w: number; addr: string; valid: boolean; p: number; rejected?: boolean; passed?: boolean}> = ({x, y, w, addr, valid, p, rejected, passed}) => {
  const color = valid ? C.green : C.red;
  const bg = rejected ? `${C.red}1a` : passed ? `${C.green}1a` : C.deep;
  return (
    <div dir="ltr" style={{position: 'absolute', left: x, top: y, width: w, height: 56, borderRadius: 12, border: `2px solid ${color}`, background: bg, display: 'flex', alignItems: 'center', padding: '0 18px', fontFamily: MONO, fontSize: 22, color: C.text, opacity: clamp(p), transform: `translateY(${(1 - clamp(p)) * 14}px)`, boxShadow: rejected ? `0 0 18px ${C.red}88` : passed ? `0 0 18px ${C.green}88` : 'none'}}>
      <span style={{fontWeight: 700, color}}>{valid ? '✓' : '✗'}</span>
      <span style={{marginLeft: 12, flex: 1}}>{addr}</span>
    </div>
  );
};

/** Vertical B-Tree index node (used in Scene 4). */
export const BTreeNode: React.FC<{x: number; y: number; w: number; h: number; label: string; color: string; glow?: number; p?: number}> = ({x, y, w, h, label, color, glow = 0, p = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 10, border: `2px solid ${color}`, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 18, fontWeight: 700, color, opacity: clamp(p), boxShadow: glow > 0.01 ? `0 0 ${20 * glow}px ${color}` : 'none', transform: `scale(${0.85 + 0.15 * clamp(p)})`}}>
    {label}
  </div>
);
