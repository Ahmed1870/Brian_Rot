import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, FPS, H, W} from './theme';

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const sec = (s: number) => Math.round(s * FPS);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Eased 0..1 progress starting at `start` frames and lasting `dur` frames. */
export const prog = (frame: number, start: number, dur: number) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

/** Pseudo-random in [0,1) - deterministic so every render frame is identical. */
export const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Tok = {text: string; ltr: boolean; color?: string};

/**
 * Tiny markup for mixed Arabic / Latin kinetic text:
 *   [[Churn Rate]]  -> one LTR token (Latin term kept intact)
 *   [[!Churn Rate]] -> same, in crimson
 *   {{فجوة التسليم}} -> Arabic words in crimson
 */
const parse = (s: string): Tok[] => {
  const out: Tok[] = [];
  const re = /\[\[(.+?)\]\]|\{\{(.+?)\}\}|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m[1]) {
      const red = m[1].startsWith('!');
      out.push({text: red ? m[1].slice(1) : m[1], ltr: true, color: red ? C.crimson : undefined});
    } else if (m[2]) {
      m[2].split(/\s+/).forEach((w) => out.push({text: w, ltr: false, color: C.crimson}));
    } else {
      out.push({text: m[3], ltr: false});
    }
  }
  return out;
};

/** Kinetic typography: plain words rising into place. No boxes, no glow. */
export const Kinetic: React.FC<{
  text: string;
  start: number;
  size?: number;
  weight?: number;
  color?: string;
  stagger?: number;
  align?: 'right' | 'center' | 'left';
}> = ({text, start, size = 64, weight = 700, color = C.white, stagger = 5, align = 'right'}) => {
  const frame = useCurrentFrame();
  const toks = parse(text);
  return (
    <div
      dir="rtl"
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.4,
        textAlign: align,
        color,
        letterSpacing: 0,
      }}
    >
      {toks.map((t, i) => {
        const p = prog(frame, start + i * stagger, 22);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              direction: t.ltr ? 'ltr' : 'rtl',
              unicodeBidi: 'isolate',
              opacity: p,
              transform: `translateY(${(1 - p) * 30}px)`,
              color: t.color ?? color,
              margin: `0 ${size * 0.13}px`,
            }}
          >
            {t.text}
          </span>
        );
      })}
    </div>
  );
};

/** Plain Latin / numeric text that must stay left-to-right. */
export const L: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <span dir="ltr" style={{direction: 'ltr', unicodeBidi: 'isolate', display: 'inline-block', ...style}}>
    {children}
  </span>
);

/** Scene wrapper: soft fade in/out at the scene edges (frames, scene-local). */
export const Fade: React.FC<{dur: number; inF?: number; outF?: number; children: React.ReactNode}> = ({
  dur,
  inF = 10,
  outF = 10,
  children,
}) => {
  const f = useCurrentFrame();
  const a = inF > 0 ? interpolate(f, [0, inF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  const b =
    outF > 0 ? interpolate(f, [dur - outF, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;
  return <AbsoluteFill style={{opacity: a * b, fontFamily: FONT}}>{children}</AbsoluteFill>;
};

/** Persistent dark analytical grid with a slow drift + vignette. */
export const GridBg: React.FC = () => {
  const frame = useCurrentFrame();
  const o = (frame * 0.12) % 80;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${o} ${o * 0.5})`}
          >
            <path d="M80 0H0V80" fill="none" stroke="#94A3B8" strokeOpacity="0.07" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(13,13,13,0) 45%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};
