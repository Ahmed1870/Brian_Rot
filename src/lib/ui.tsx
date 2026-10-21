import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {CAIRO} from '../fonts';
import {clamp, hash, ramp, sp, SP} from './anim';

export const glass = (o: {r?: number; glow?: number; tint?: string} = {}): React.CSSProperties => ({
  background: `linear-gradient(135deg, ${o.tint ?? 'rgba(37,99,235,0.30)'}, rgba(15,23,42,0.62) 58%, rgba(0,240,255,0.10))`,
  border: '1.5px solid rgba(0,240,255,0.40)',
  borderRadius: o.r ?? 28,
  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 40px rgba(37,99,235,0.16), 0 0 ${o.glow ?? 28}px rgba(0,240,255,0.20)`,
});

/** Fade wrapper for a scene (local frame). */
export const SceneShell: React.FC<{dur: number; fadeIn?: number; fadeOut?: number; children: React.ReactNode}> = ({
  dur,
  fadeIn = 10,
  fadeOut = 14,
  children,
}) => {
  const f = useCurrentFrame();
  const o = Math.min(fadeIn ? ramp(f, 0, fadeIn) : 1, fadeOut ? 1 - ramp(f, dur - fadeOut, dur) : 1);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** Particle burst in an SVG overlay (coordinates in the parent's space). */
export const Burst: React.FC<{
  f: number;
  start: number;
  x: number;
  y: number;
  count?: number;
  colors?: string[];
  speed?: number;
  life?: number;
  size?: number;
  gravity?: number;
  seed?: number;
}> = ({f, start, x, y, count = 24, colors = [C.cyan, C.white, C.gold], speed = 26, life = 40, size = 5, gravity = 0.18, seed = 1}) => {
  const t = f - start;
  if (t < 0 || t > life) return null;
  return (
    <g>
      {Array.from({length: count}, (_, i) => {
        const a = hash(i * 3.1 + seed) * Math.PI * 2;
        const v = speed * (0.35 + hash(i * 5.7 + seed) * 0.65);
        const d = v * 9 * (1 - Math.exp(-t / 9));
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d + gravity * t * t * 0.5;
        const k = 1 - t / life;
        return <circle key={i} cx={px} cy={py} r={Math.max(0.1, size * (0.4 + k * 0.6) * (0.6 + hash(i + seed) * 0.8))}
          fill={colors[i % colors.length]} opacity={k} />;
      })}
    </g>
  );
};

/** Expanding ring(s) – shockwave / click ripple. */
export const Ring: React.FC<{f: number; start: number; x: number; y: number; max?: number; life?: number; color?: string; w?: number}> = ({
  f, start, x, y, max = 120, life = 20, color = C.cyan, w = 3,
}) => {
  const t = (f - start) / life;
  if (t < 0 || t > 1) return null;
  const e = 1 - Math.pow(1 - t, 3);
  return <circle cx={x} cy={y} r={Math.max(0.1, max * e)} fill="none" stroke={color} strokeWidth={w * (1 - t) + 0.5} opacity={1 - t} />;
};

/** Free-floating Arabic RTL kinetic caption (global frame; word-by-word spring). */
export const Caption: React.FC<{text: string; from: number; to?: number; y?: number; size?: number}> = ({
  text, from, to, y = 1772, size = 54,
}) => {
  const f = useCurrentFrame();
  if (f < from || (to !== undefined && f > to + 24)) return null;
  const words = text.split(' ').filter(Boolean);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y - size * 1.8, height: size * 3.6, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', direction: 'rtl', columnGap: size * 0.28,
        fontFamily: CAIRO, fontWeight: 900, fontSize: size, lineHeight: 1.45, color: C.white, textAlign: 'center',
        textShadow: '0 0 18px rgba(0,240,255,0.55), 0 4px 14px rgba(0,0,0,0.8)'}}>
        {words.map((w, i) => {
          const s = sp(f, SP.text, from + i * 4);
          const ex = to === undefined ? 0 : clamp(sp(f, SP.soft, to + i * 2));
          return (
            <span key={i} style={{display: 'inline-block', opacity: clamp(s * 3) * (1 - ex), transformOrigin: '50% 85%',
              transform: `translateY(${(1 - s) * size * 0.9 - ex * size * 0.7}px) scale(${1 - (1 - s) * 0.3}, ${1 + (1 - s) * 0.8})`}}>
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- icons (flat vector, 24 box) ----------------
type IP = {s?: number; c?: string};
const base = (s: number) => ({width: s, height: s, viewBox: '0 0 24 24'});
export const IconFb: React.FC<IP> = ({s = 40, c = '#1877F2'}) => (
  <svg {...base(s)}><rect x="1" y="1" width="22" height="22" rx="6" fill={c} />
    <path d="M13.4 21v-7.4h2.5l.4-3h-2.9V8.7c0-.9.3-1.4 1.5-1.4h1.5V4.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.700 1.300-3.700 3.800v2.300H8v3h2.500V21z" fill="#fff" /></svg>
);
export const IconIg: React.FC<IP> = ({s = 40, c = '#E1306C'}) => (
  <svg {...base(s)}><rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke={c} strokeWidth="2" />
    <circle cx="12" cy="12" r="4.5" fill="none" stroke={c} strokeWidth="2" /><circle cx="17.600" cy="6.400" r="1.300" fill={c} /></svg>
);
export const IconTt: React.FC<IP> = ({s = 40, c = '#00F0FF'}) => (
  <svg {...base(s)}><circle cx="9" cy="17.500" r="3.500" fill="none" stroke={c} strokeWidth="2.200" />
    <path d="M12.500 17.500V3.500h2.800c.3 2.300 1.700 3.700 4 4" fill="none" stroke={c} strokeWidth="2.200" strokeLinecap="round" /></svg>
);
export const IconYt: React.FC<IP> = ({s = 40, c = '#FF0033'}) => (
  <svg {...base(s)}><rect x="1.500" y="5" width="21" height="14" rx="4.500" fill={c} /><path d="M10 9l5.500 3L10 15z" fill="#fff" /></svg>
);
export const IconGlobe: React.FC<IP> = ({s = 40, c = C.cyan}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="1.800"><circle cx="12" cy="12" r="9.500" /><ellipse cx="12" cy="12" rx="4" ry="9.500" /><path d="M2.500 12h19M4 7h16M4 17h16" /></svg>
);
export const IconCap: React.FC<IP> = ({s = 40, c = C.gold}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="1.800" strokeLinejoin="round"><path d="M12 4L1.500 9 12 14l10.500-5z" /><path d="M6 11.500v5c0 1.500 3 3 6 3s6-1.500 6-3v-5" /><path d="M22.500 9v6" /></svg>
);
export const IconPhone: React.FC<IP> = ({s = 40, c = '#22C55E'}) => (
  <svg {...base(s)}><path fill={c} d="M6.600 10.800c1.400 2.800 3.800 5.100 6.600 6.600l2.200-2.200c.3-.3.7-.4 1-.2 1.100.4 2.300.6 3.600.6.600 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.600 21 3 13.400 3 4c0-.6.4-1 1-1h3.500c.6 0 1 .4 1 1 0 1.300.2 2.500.6 3.600.1.300 0 .7-.2 1z" /></svg>
);
export const IconBookmark: React.FC<IP> = ({s = 40, c = C.cyan}) => (
  <svg {...base(s)}><path fill={c} d="M17 3H7c-1.100 0-2 .9-2 2v16l7-3 7 3V5c0-1.100-.9-2-2-2z" /></svg>
);
export const IconAt: React.FC<IP> = ({s = 40, c = C.gold}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="2.200" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-4 8" /></svg>
);
export const IconMail: React.FC<IP> = ({s = 40, c = C.cyan}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><rect x="2.500" y="5" width="19" height="14" rx="3" /><path d="M3 7l9 6.500L21 7" /></svg>
);
export const IconCheck: React.FC<IP> = ({s = 40, c = C.gold}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4.500 12.500l5 5 10-11" /></svg>
);
export const IconTarget: React.FC<IP> = ({s = 40, c = C.gold}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" fill={c} /></svg>
);
export const IconSearch: React.FC<IP> = ({s = 40, c = C.cyan}) => (
  <svg {...base(s)} fill="none" stroke={c} strokeWidth="2.400" strokeLinecap="round"><circle cx="10.500" cy="10.500" r="6.500" /><path d="M15.500 15.500L21 21" /></svg>
);
