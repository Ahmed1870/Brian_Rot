import React from 'react';
import { C, FONT_AR, FONT_MONO } from '../theme';
import { LOGO_PATHS, LOGO_SIZE, LOGO_TRANSFORM } from '../logoData';
import { p, win } from '../anim';

type TxtProps = {
  x: number;
  y: number;
  size?: number;
  fill?: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  children: React.ReactNode;
};

/** Arabic text (RTL). NOTE: with rtl, anchor "start" = RIGHT edge. */
export const AR: React.FC<TxtProps> = ({ x, y, size = 40, fill = C.text, weight = 700, anchor = 'middle', opacity = 1, children }) => (
  <text x={x} y={y} direction="rtl" textAnchor={anchor} fontFamily={FONT_AR} fontSize={size} fontWeight={weight} fill={fill} opacity={opacity}>
    {children}
  </text>
);

/** Latin / code text (LTR). */
export const EN: React.FC<TxtProps & { mono?: boolean }> = ({ x, y, size = 32, fill = C.text, weight = 400, anchor = 'middle', opacity = 1, mono = true, children }) => (
  <text x={x} y={y} direction="ltr" textAnchor={anchor} fontFamily={mono ? FONT_MONO : FONT_AR} fontSize={size} fontWeight={weight} fill={fill} opacity={opacity}>
    {children}
  </text>
);

/** Fade + slide-up reveal for a group. Optional fade-out window end `until`. */
export const Reveal: React.FC<{ t: number; at: number; dur?: number; dy?: number; until?: number; children: React.ReactNode }> = ({ t, at, dur = 0.6, dy = 24, until, children }) => {
  const k = p(t, at, dur);
  const o = until === undefined ? k : win(t, at, until, dur);
  return (
    <g opacity={o} transform={`translate(0 ${(1 - k) * dy})`}>
      {children}
    </g>
  );
};

/** Scale a group around (cx, cy). */
export const Scaled: React.FC<{ cx: number; cy: number; s: number; children: React.ReactNode }> = ({ cx, cy, s, children }) => (
  <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>
);

/** Flat card with optional glow (stacked wider strokes, no filters). */
export const Card: React.FC<{ x: number; y: number; w: number; h: number; stroke?: string; glow?: number; fill?: string; r?: number }> = ({ x, y, w, h, stroke = C.line, glow = 0, fill = C.card, r = 28 }) => (
  <g>
    {glow > 0 && (
      <>
        <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} rx={r + 10} fill="none" stroke={stroke} strokeWidth={10} opacity={0.12 * glow} />
        <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx={r + 5} fill="none" stroke={stroke} strokeWidth={6} opacity={0.25 * glow} />
      </>
    )}
    <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={3} />
  </g>
);

/** Title block: Arabic big + English small, visible between a and b. */
export const Header: React.FC<{ t: number; a: number; b: number; ar: string; en: string; y?: number; color?: string }> = ({ t, a, b, ar, en, y = 130, color = C.client }) => (
  <Reveal t={t} at={a} until={b} dy={20}>
    <AR x={960} y={y} size={66} weight={900}>{ar}</AR>
    <EN x={960} y={y + 58} size={34} fill={color} weight={600}>{en}</EN>
  </Reveal>
);

/** Shared dark background: gradient + dot grid (cheap, no noise filters). */
export const Background: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="45%" r="75%">
        <stop offset="0%" stopColor="#16223B" />
        <stop offset="100%" stopColor={C.bg} />
      </radialGradient>
      <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse">
        <circle cx="24" cy="24" r="1.6" fill="#475569" opacity="0.35" />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="url(#bgGlow)" />
    <rect width={1920} height={1080} fill="url(#dots)" />
  </svg>
);

/** Traced Monzoma logo drawn at (x, y) with the given pixel size. */
export const Logo: React.FC<{ x: number; y: number; size: number; fill?: string }> = ({ x, y, size, fill = C.text }) => (
  <g transform={`translate(${x} ${y}) scale(${size / LOGO_SIZE})`}>
    <g transform={LOGO_TRANSFORM} fill={fill} stroke="none">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  </g>
);

/** "TCP/IP Port 5432 ───► [PostgreSQL Engine]" built from text + vector arrow. */
export const Blueprint: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 1 }) => (
  <g opacity={opacity}>
    <EN x={410} y={y} size={40} anchor="start" fill={C.client} weight={600}>TCP/IP Port 5432</EN>
    <path d={`M 830 ${y - 14} H 1010`} stroke={C.opt} strokeWidth={5} strokeLinecap="round" />
    <path d={`M 996 ${y - 30} L 1030 ${y - 14} L 996 ${y + 2} Z`} fill={C.opt} />
    <EN x={1060} y={y} size={40} anchor="start" fill={C.db} weight={600}>[PostgreSQL Engine]</EN>
  </g>
);
