import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, LESSON, LOGO_FILE, MONO, SCENES, TOTAL_FRAMES} from './theme';
import {FontLoader, XL} from './xl';

export * from './xl';
export * from './xlui';

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const sec = (s: number) => Math.round(s * FPS);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const pop = (frame: number, start: number) =>
  frame < start ? 0 : spring({frame: frame - start, fps: FPS, config: {damping: 13, stiffness: 150, mass: 0.7}});

export const typed = (text: string, frame: number, start: number, cps = 1.4) =>
  text.slice(0, Math.floor(clamp((frame - start) * cps, 0, text.length)));

export const lin = (f: number, start: number, dur: number) => clamp((f - start) / dur);

const smooth = (t: number) => t * t * (3 - 2 * t);
/** Piecewise pointer path: [{f, x, y}] with eased segments. */
export const track = (f: number, pts: Array<{f: number; x: number; y: number}>) => {
  if (f <= pts[0].f) return {x: pts[0].x, y: pts[0].y};
  for (let i = 1; i < pts.length; i++) {
    if (f <= pts[i].f) {
      const a = pts[i - 1], b = pts[i];
      const t = smooth(clamp((f - a.f) / Math.max(1, b.f - a.f)));
      return {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t)};
    }
  }
  const l = pts[pts.length - 1];
  return {x: l.x, y: l.y};
};

/** Insert a short dwell after each waypoint so clicks land exactly on their targets. */
export const dwell = (pts: Array<{f: number; x: number; y: number}>, frames = 9) => {
  const out: Array<{f: number; x: number; y: number}> = [];
  pts.forEach((p, i) => {
    out.push(p);
    const nx = pts[i + 1];
    if (nx && nx.f - p.f > frames * 2) out.push({f: p.f + frames, x: p.x, y: p.y});
  });
  return out;
};

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const o = (f * 0.2) % 48;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <FontLoader />
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o})`}>
            <circle cx="2" cy="2" r="1.6" fill="#94A3B8" fillOpacity="0.16" />
          </pattern>
        </defs>
        <rect width={1920} height={1080} fill="url(#dots)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(15,23,42,0) 55%, rgba(2,6,23,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

export const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const starts = Object.values(SCENES).map((s) => s.from);
  const active = starts.filter((s) => f >= s).length - 1;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Img src={staticFile(LOGO_FILE)} style={{position: 'absolute', left: 48, top: 8, height: 56, width: 67}} />
      <div style={{position: 'absolute', left: 130, top: 26, fontFamily: MONO, fontSize: 22, color: C.muted, letterSpacing: 0.5}}>
        <span style={{color: C.green}}>Excel</span> From Zero to Professional · <span style={{color: C.text}}>Lesson {String(LESSON).padStart(2, '0')}</span>
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

export type InFx = 'none' | 'zoom' | 'left' | 'morph' | 'up' | 'fade';
export type OutFx = 'none' | 'zoom' | 'left' | 'morph' | 'up' | 'down' | 'fade' | 'black';
const N = 18;

export const Stage: React.FC<{dur: number; inFx?: InFx; outFx?: OutFx; children: React.ReactNode}> = ({dur, inFx = 'fade', outFx = 'fade', children}) => {
  const f = useCurrentFrame();
  const pi = inFx === 'none' ? 1 : prog(f, 0, N);
  const outLen = outFx === 'black' ? 24 : N;
  const po = outFx === 'none' ? 0 : prog(f, dur - outLen, outLen);
  const a = 1 - pi;
  let x = 0, y = 0, s = 1;
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

export const Mix: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span dir="auto" style={{unicodeBidi: 'plaintext', fontFamily: FONT, ...style}}>{children}</span>
);

export const TopBadge: React.FC<{text: string; from: number; to: number; color?: string}> = ({text, from, to, color = C.blue}) => {
  const f = useCurrentFrame();
  if (f < from || f > to + 12) return null;
  const p = pop(f, from);
  const o = 1 - prog(f, to, 12);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{transform: `scale(${0.85 + 0.15 * p})`, background: C.card, border: `2px solid ${color}`, borderRadius: 999, padding: '14px 40px', boxShadow: `0 0 0 6px ${color}22`}}>
        <Mix style={{fontSize: 36, fontWeight: 700, color: C.text}}>{text}</Mix>
      </div>
    </div>
  );
};

export const Caption: React.FC<{text: string; from: number; to: number; tone?: 'normal' | 'danger' | 'ok'}> = ({text, from, to, tone = 'normal'}) => {
  const edge = tone === 'danger' ? C.red : tone === 'ok' ? C.green : C.border;
  const f = useCurrentFrame();
  if (f < from || f > to + 12) return null;
  const shown = typed(text, f, from, 1.6);
  const parts = shown.split(/(──\[[^\]]*\]──►|──►)/);
  const o = 1 - prog(f, to, 12);
  const blink = Math.floor(f / 12) % 2 === 0 ? 1 : 0;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 944, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div dir="ltr" style={{fontFamily: MONO, fontSize: 28, color: C.text, background: C.card, border: `2px solid ${edge}`, borderRadius: 16, padding: '16px 34px', whiteSpace: 'pre', minHeight: 44, boxShadow: tone === 'normal' ? 'none' : `0 0 0 6px ${edge}22`}}>
        {parts.map((p, i) => (
          <span key={i} style={{color: /^──/.test(p) ? C.amber : C.text}}>{p}</span>
        ))}
        <span style={{opacity: blink, color: C.green}}>▌</span>
      </div>
    </div>
  );
};

export const Chip: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.blue, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, border: `2px solid ${color}`, color, borderRadius: 999, padding: '6px 18px', fontFamily: MONO, fontSize: 24, fontWeight: 700, background: `${color}18`, ...style}}>{children}</div>
);

export const Check: React.FC<{size?: number; color?: string; p: number}> = ({size = 44, color = C.green, p}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={{transform: `scale(${p})`, opacity: clamp(p)}}>
    <circle cx={22} cy={22} r={20} fill={`${color}22`} stroke={color} strokeWidth={3} />
    <polyline points="12,23 19,30 33,14" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Warn: React.FC<{size?: number; color?: string}> = ({size = 64, color = C.red}) => (
  <svg width={size} height={size * 0.92} viewBox="0 0 70 64">
    <path d="M35 4 L66 58 H4 Z" fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" />
    <line x1={35} y1={24} x2={35} y2={40} stroke={color} strokeWidth={6} strokeLinecap="round" />
    <circle cx={35} cy={50} r={3.5} fill={color} />
  </svg>
);

/* ------------------------------------------------------------------ Excel window host (zoom + frame) */
export const WIN = {x: 80, y: 150, w: 1760, h: 770};

export type Cam = {fx: number; fy: number; z: number};
/** Window frame that holds the Excel app and applies a camera (zoom focus in logical app px). */
export const ExcelWindow: React.FC<{cam?: Cam; glow?: string; children: React.ReactNode}> = ({cam = {fx: XL.W / 2, fy: XL.H / 2, z: 1}, glow, children}) => {
  const s = XL.SCALE * cam.z;
  const tx = clamp(WIN.w / 2 - cam.fx * s, WIN.w - XL.W * s, 0);
  const ty = clamp(WIN.h / 2 - cam.fy * s, WIN.h - XL.H * s, 0);
  return (
    <div style={{position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 14, overflow: 'hidden', border: `2px solid ${glow ?? '#334155'}`, boxShadow: `0 40px 120px rgba(2,6,23,0.7)${glow ? `, 0 0 40px ${glow}55` : ''}`, background: '#fff', boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: XL.W, height: XL.H, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>{children}</div>
    </div>
  );
};

/** Camera helper: ease between two cams. */
export const camLerp = (a: Cam, b: Cam, t: number): Cam => ({fx: lerp(a.fx, b.fx, t), fy: lerp(a.fy, b.fy, t), z: lerp(a.z, b.z, t)});
export const CAM0: Cam = {fx: XL.W / 2, fy: XL.H / 2, z: 1};

/** Neon region frame drawn in logical app coordinates. */
export const Neon: React.FC<{x: number; y: number; w: number; h: number; color: string; p: number; label?: string; labelBelow?: boolean}> = ({x, y, w, h, color, p, label, labelBelow}) => {
  const f = useCurrentFrame();
  const pulse = 0.65 + 0.35 * Math.sin(f * 0.13);
  if (p <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x - 3, top: y - 3, width: w + 6, height: h + 6, border: `3px solid ${color}`, borderRadius: 6, boxSizing: 'border-box', opacity: p, boxShadow: `0 0 ${18 * pulse}px ${color}, inset 0 0 ${14 * pulse}px ${color}55`, zIndex: 20, pointerEvents: 'none'}}>
      {label ? (
        <div style={{position: 'absolute', right: 8, [labelBelow ? 'bottom' : 'top']: labelBelow ? -2 : -2, transform: `translateY(${labelBelow ? '100%' : '-100%'})`, background: color, color: '#0B1222', fontFamily: MONO, fontSize: 13, fontWeight: 700, padding: '2px 9px', borderRadius: 4, whiteSpace: 'nowrap'}}>{label}</div>
      ) : null}
    </div>
  );
};

// Camera presets (logical Excel px). Scenes hand the camera to each other so the cuts are continuous.
export const CAM_QAT: Cam = {fx: 430, fy: 215, z: 1.6};
export const CAM_DLG: Cam = {fx: 768, fy: 336, z: 1.08};
export const CAM_NB: Cam = {fx: 400, fy: 190, z: 1.7};
export const CAM_STATUS: Cam = {fx: 1200, fy: 560, z: 1.5};
export const CAM_MENU: Cam = {fx: 1000, fy: 370, z: 1.12};
