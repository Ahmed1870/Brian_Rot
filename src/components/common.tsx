import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

/** Dark scene shell with slate grid + fade/slide in & out. No containers, no glows. */
export const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 15, dur - 12, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(f, [0, 20], [60, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 28}, (_, i) => (
          <line key={'v' + i} x1={i * 40} y1={0} x2={i * 40} y2={1920} stroke={C.grid} strokeWidth={1} opacity={0.45} />
        ))}
        {Array.from({length: 49}, (_, i) => (
          <line key={'h' + i} x1={0} y1={i * 40} x2={1080} y2={i * 40} stroke={C.grid} strokeWidth={1} opacity={0.45} />
        ))}
      </svg>
      <AbsoluteFill style={{opacity: o, transform: `translateY(${y}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Kinetic text. Pass `top` for absolute placement, OR put it inside <Stack> (no `top`)
 * so stacked lines flow one under another and can never overlap.
 */
export const KText: React.FC<{
  at: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: number;
  top?: number;
  align?: 'center' | 'right' | 'left';
  style?: React.CSSProperties;
  ltr?: boolean;
}> = ({at, children, size = 64, color = C.white, weight = 900, top, align = 'center', style, ltr}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 16, stiffness: 120}});
  const o = interpolate(f - at, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      className={top === undefined ? 'w-full px-14' : 'absolute w-full px-14'}
      style={{
        top,
        textAlign: align,
        fontSize: size,
        color,
        fontWeight: weight,
        lineHeight: 1.3,
        opacity: o,
        direction: ltr ? 'ltr' : 'rtl',
        transform: `translateY(${(1 - p) * 70}px) scale(${0.92 + p * 0.08})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Vertical flow container for text lines (guarantees no overlap between lines). */
export const Stack: React.FC<{top: number; gap?: number; children: React.ReactNode}> = ({top, gap = 18, children}) => (
  <div className="absolute w-full flex flex-col items-center" style={{top, gap}}>
    {children}
  </div>
);

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
export const prog = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
