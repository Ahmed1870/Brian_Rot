import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from './theme';
import {mono} from './fonts';

export const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

/** Scene shell: slate background + faint grid + soft fade/slide in-out. */
export const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 14, dur - 10, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(f, [0, 20], [50, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 33}, (_, i) => (
          <line key={'v' + i} x1={i * 60} y1={0} x2={i * 60} y2={1080} stroke={C.line} strokeWidth={1} opacity={0.28} />
        ))}
        {Array.from({length: 19}, (_, i) => (
          <line key={'h' + i} x1={0} y1={i * 60} x2={1920} y2={i * 60} stroke={C.line} strokeWidth={1} opacity={0.28} />
        ))}
      </svg>
      <AbsoluteFill style={{opacity: o, transform: `translateX(${x}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Top zone (y 36-170): Arabic title + English subtitle. Diagrams start at y>=200. */
export const Title: React.FC<{ar: string; en: string; color?: string}> = ({ar, en, color = C.text}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - 4, fps, config: {damping: 16, stiffness: 120}});
  return (
    <div className="absolute w-full flex flex-col items-center" style={{top: 34, opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)`}}>
      <div style={{fontSize: 62, fontWeight: 900, color, lineHeight: 1.2, direction: 'rtl'}}>{ar}</div>
      <div style={{fontSize: 30, fontWeight: 700, color: C.blue, fontFamily: mono, direction: 'ltr', marginTop: 4}}>{en}</div>
    </div>
  );
};

/** Bottom caption zone (y 925-1040), shown only between `from` and `to` (local frames). */
export const Caption: React.FC<{from: number; to: number; color?: string; ltr?: boolean; children: React.ReactNode; size?: number}> = ({
  from, to, color = C.text, ltr = true, children, size = 42,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [from, from + 14, to - 14, to], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(f, [from, from + 16], [24, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (f < from || f > to) return null;
  return (
    <div className="absolute w-full flex justify-center" style={{top: 930, opacity: o, transform: `translateY(${y}px)`}}>
      <div style={{fontSize: size, fontWeight: 700, color, fontFamily: ltr ? mono : undefined, direction: ltr ? 'ltr' : 'rtl', textAlign: 'center', padding: '0 60px'}}>{children}</div>
    </div>
  );
};

export const Panel: React.FC<{x: number; y: number; w: number; h: number; stroke?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  x, y, w, h, stroke = C.line, children, style,
}) => (
  <div className="absolute" style={{left: x, top: y, width: w, height: h, background: C.panel, border: `2px solid ${stroke}`, borderRadius: 24, ...style}}>
    {children}
  </div>
);
