// Creative motion effects for Lesson 15 — Dynamic Arrays theme.
// All effects are pure SVG/HTML, no external deps. Designed for fast rendering.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FPS, MONO} from './theme';
import {XL, clamp, geo, lerp, prog, sec} from './kit';

/* ------------------------------------------------------------------ Liquid Spill Flow
   A wave-like fill that "pours" down a column, simulating dynamic array spill.
   Used in Scene 1 (right panel) and Scene 5 (enterprise). */
export const LiquidSpill: React.FC<{
  x: number; topY: number; bottomY: number; w: number; p: number; color?: string;
}> = ({x, topY, bottomY, w, p, color = C.blue}) => {
  const f = useCurrentFrame();
  if (p <= 0) return null;
  const fillH = (bottomY - topY) * clamp(p);
  const wave = Math.sin(f * 0.2) * 3;
  const surfaceY = topY + fillH + wave;
  return (
    <svg width={w + 20} height={bottomY - topY + 20} style={{position: 'absolute', left: x - 10, top: topY - 10, pointerEvents: 'none', zIndex: 22}}>
      <defs>
        <linearGradient id={`spill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.45} />
          <stop offset="100%" stopColor={color} stopOpacity={0.15} />
        </linearGradient>
      </defs>
      <path
        d={`M0 10 Q ${w / 4} ${10 - wave * 2} ${w / 2} 10 T ${w} 10 L ${w} ${fillH + 10} L 0 ${fillH + 10} Z`}
        fill={`url(#spill-${color.replace('#', '')})`}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.8}
      />
      {/* sparkle dots */}
      {clamp(p) > 0.3 ? [0.2, 0.5, 0.8].map((fx, i) => (
        <circle key={i} cx={w * fx} cy={topY - topY + 14 + ((f * 2 + i * 30) % Math.max(1, fillH))} r={2} fill={color} opacity={0.6} />
      )) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ Animated Spill Border
   A dashed blue border that "draws itself" around the spill range,
   then pulses gently to show it's "live". */
export const SpillBorder: React.FC<{
  x: number; y: number; w: number; h: number; p: number; color?: string; label?: string;
}> = ({x, y, w, h, p, color = C.blue, label}) => {
  const f = useCurrentFrame();
  if (p <= 0.01) return null;
  const dashOffset = (f * 0.5) % 16;
  const pulse = 0.7 + 0.3 * Math.sin(f * 0.1);
  return (
    <svg width={w + 20} height={h + 40} style={{position: 'absolute', left: x - 10, top: y - 10, pointerEvents: 'none', zIndex: 26}}>
      <rect x={5} y={5} width={w} height={h} fill="none" stroke={color} strokeWidth={2.5} strokeDasharray="8 4" strokeDashoffset={-dashOffset} opacity={p * pulse} />
      <rect x={5} y={5} width={w} height={h} fill="none" stroke={color} strokeWidth={1} opacity={p * 0.3} />
      {label ? (
        <>
          <rect x={5} y={-22} width={label.length * 9 + 16} height={24} fill={color} rx={5} opacity={p} />
          <text x={5 + (label.length * 9 + 16) / 2} y={-6} textAnchor="middle" fill="#0B1222" fontFamily={MONO} fontSize={15} fontWeight={700} opacity={p}>{label}</text>
        </>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ Impact Ring
   Expanding ring used when #SPILL! error appears or clears. */
export const ImpactRing: React.FC<{
  x: number; y: number; p: number; color?: string; maxR?: number;
}> = ({x, y, p, color = C.red, maxR = 60}) => {
  if (p <= 0 || p >= 1) return null;
  const r = maxR * p;
  return (
    <svg width={maxR * 2 + 20} height={maxR * 2 + 20} style={{position: 'absolute', left: x - maxR - 10, top: y - maxR - 10, pointerEvents: 'none', zIndex: 30}}>
      <circle cx={maxR + 10} cy={maxR + 10} r={r} fill="none" stroke={color} strokeWidth={3 * (1 - p)} opacity={(1 - p) * 0.9} />
      <circle cx={maxR + 10} cy={maxR + 10} r={r * 0.6} fill={color} opacity={(1 - p) * 0.2} />
    </svg>
  );
};

/* ------------------------------------------------------------------ Glowing Token
   A single character/symbol that glows and pulses — used for #, @, #SPILL! badges. */
export const GlowingToken: React.FC<{
  text: string; x: number; y: number; p: number; color: string; size?: number;
}> = ({text, x, y, p, color, size = 28}) => {
  const f = useCurrentFrame();
  if (p <= 0.01) return null;
  const pulse = 0.8 + 0.2 * Math.sin(f * 0.15);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, opacity: p,
      transform: `scale(${(0.7 + 0.3 * p) * pulse})`,
      fontFamily: MONO, fontSize: size, fontWeight: 700, color,
      textShadow: `0 0 ${12 * p}px ${color}, 0 0 ${24 * p}px ${color}88`,
      zIndex: 35, pointerEvents: 'none',
      whiteSpace: 'nowrap',
    }}>{text}</div>
  );
};

/* ------------------------------------------------------------------ Drag Handle Icon
   The legacy fill-handle crosshair that "struggles" to drag down. */
export const DragHandle: React.FC<{x: number; y: number; p: number; struggling: boolean}> = ({x, y, p, struggling}) => {
  const f = useCurrentFrame();
  if (p <= 0.01) return null;
  const shake = struggling ? Math.sin(f * 0.8) * 2 : 0;
  const color = struggling ? C.amber : C.green;
  return (
    <svg width={30} height={30} style={{position: 'absolute', left: x + shake, top: y, opacity: p, zIndex: 32, pointerEvents: 'none'}}>
      <rect x={8} y={8} width={14} height={14} fill="#fff" stroke={color} strokeWidth={2} />
      <line x1={11} y1={12} x2={19} y2={12} stroke={color} strokeWidth={1.5} />
      <line x1={11} y1={15} x2={19} y2={15} stroke={color} strokeWidth={1.5} />
      <line x1={11} y1={18} x2={19} y2={18} stroke={color} strokeWidth={1.5} />
      {/* drag arrow */}
      <line x1={15} y1={22} x2={15} y2={29} stroke={color} strokeWidth={2} />
      <polygon points={`12,27 15,30 18,27`} fill={color} />
    </svg>
  );
};

/* ------------------------------------------------------------------ Expansion Arrow
   Shows the spill range growing when new rows are added. */
export const ExpansionArrows: React.FC<{x: number; y: number; p: number; color?: string}> = ({x, y, p, color = C.green}) => {
  if (p <= 0.01) return null;
  return (
    <svg width={60} height={40} style={{position: 'absolute', left: x, top: y, opacity: p, zIndex: 28, pointerEvents: 'none'}}>
      <line x1={30} y1={5} x2={30} y2={35} stroke={color} strokeWidth={2.5} strokeDasharray="4 3" />
      <polygon points={`22,30 30,38 38,30`} fill={color} />
      <polygon points={`22,10 30,2 38,10`} fill={color} />
    </svg>
  );
};

/* ------------------------------------------------------------------ Counter Badge
   Animated number counter for "15/76" style displays. */
export const CounterBadge: React.FC<{value: number; total: number; label: string; p: number; color?: string}> = ({value, total, label, p, color = C.green}) => {
  if (p <= 0.01) return null;
  return (
    <div style={{
      opacity: p, transform: `scale(${0.85 + 0.15 * p})`,
      display: 'flex', alignItems: 'baseline', gap: 6,
      fontFamily: MONO,
    }}>
      <span style={{fontSize: 52, fontWeight: 700, color}}>{value}</span>
      <span style={{fontSize: 28, color: C.muted}}>/ {total}</span>
      <span style={{fontSize: 20, color: C.muted, marginLeft: 12}}>{label}</span>
    </div>
  );
};
