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

/** "left ──► right" caption: texts anchored around a vector arrow. */
export const Arrowed: React.FC<{ y: number; left: string; right: string; leftColor?: string; rightColor?: string; size?: number; leftArabic?: boolean }> = ({ y, left, right, leftColor = C.client, rightColor = C.db, size = 40, leftArabic = false }) => (
  <g>
    {leftArabic ? (
      <AR x={900} y={y} size={size} fill={leftColor} anchor="start">{left}</AR>
    ) : (
      <EN x={900} y={y} size={size} anchor="end" fill={leftColor} weight={600}>{left}</EN>
    )}
    <path d={`M 930 ${y - 14} H 1010`} stroke={C.opt} strokeWidth={5} strokeLinecap="round" />
    <path d={`M 996 ${y - 30} L 1030 ${y - 14} L 996 ${y + 2} Z`} fill={C.opt} />
    <EN x={1060} y={y} size={size} anchor="start" fill={rightColor} weight={600}>{right}</EN>
  </g>
);

/** Simple flat person (customer) icon with shopping bag, centered at (x,y). */
export const PersonIcon: React.FC<{ x: number; y: number; s?: number; color?: string; bag?: boolean }> = ({ x, y, s = 1, color = C.client, bag = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-60} r={34} fill={color} />
    <path d="M -62 70 C -62 10 -40 -14 0 -14 C 40 -14 62 10 62 70 Z" fill={color} fillOpacity={0.85} />
    {bag && (
      <g>
        <rect x={34} y={20} width={54} height={60} rx={8} fill={C.bg} stroke={C.opt} strokeWidth={6} />
        <path d="M 48 20 C 48 -2 74 -2 74 20" fill="none" stroke={C.opt} strokeWidth={6} strokeLinecap="round" />
      </g>
    )}
  </g>
);

/** Key glyph (primary / foreign key), centered at (x,y). */
export const KeyIcon: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({ x, y, s = 1, color = C.db, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={-34} cy={0} r={20} />
    <path d="M -14 0 H 54 M 34 0 V 20 M 52 0 V 16" />
  </g>
);

/** Padlock; `closed` 0..1 animates the shackle. */
export const LockIcon: React.FC<{ x: number; y: number; s?: number; color?: string; closed?: number }> = ({ x, y, s = 1, color = C.db, closed = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M -20 -4 V ${-26 - (1 - closed) * 20} C -20 -50 20 -50 20 ${-26 - (1 - closed) * 20} V ${-4 - (1 - closed) * 14}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
    <rect x={-32} y={-6} width={64} height={46} rx={10} fill={color} fillOpacity={0.25} stroke={color} strokeWidth={6} />
    <circle cx={0} cy={16} r={6} fill={color} />
  </g>
);

/** Flat security shield. */
export const ShieldIcon: React.FC<{ x: number; y: number; s?: number; color?: string; fillOp?: number }> = ({ x, y, s = 1, color = C.accent, fillOp = 0.18 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -110 L 86 -76 V 4 C 86 62 36 98 0 114 C -36 98 -86 62 -86 4 V -76 Z" fill={color} fillOpacity={fillOp} stroke={color} strokeWidth={7} strokeLinejoin="round" />
  </g>
);

export type Col = { k: string; w: number; ar?: boolean; badge?: { t: string; c: string }; color?: string };
export type RowStyle = { fill?: string; stroke?: string; opacity?: number; dx?: number; txt?: string };

/** Compact data table: header + rows (no outer card). */
export const MiniTable: React.FC<{ x: number; y: number; cols: Col[]; rows: string[][]; rowH?: number; hdrH?: number; rowStyle?: (i: number) => RowStyle; fs?: number }> = ({ x, y, cols, rows, rowH = 64, hdrH = 56, rowStyle, fs = 26 }) => {
  const cx = (i: number) => x + cols.slice(0, i).reduce((a, c) => a + c.w, 0);
  const W = cols.reduce((a, c) => a + c.w, 0);
  return (
    <g>
      {cols.map((c, i) => (
        <g key={c.k}>
          <rect x={cx(i) + 3} y={y} width={c.w - 6} height={hdrH - 6} rx={10} fill={c.color ?? C.client} opacity={0.2} />
          <EN x={cx(i) + c.w / 2 - (c.badge ? 22 : 0)} y={y + hdrH / 2 + 6} size={fs - 4} fill={c.color ?? C.client} weight={600}>{c.k}</EN>
          {c.badge && (
            <g>
              <rect x={cx(i) + c.w - 64} y={y + hdrH / 2 - 17} width={52} height={28} rx={14} fill={c.badge.c} />
              <EN x={cx(i) + c.w - 38} y={y + hdrH / 2 + 4} size={16} fill={C.bg} weight={600}>{c.badge.t}</EN>
            </g>
          )}
        </g>
      ))}
      {rows.map((r, ri) => {
        const st = rowStyle ? rowStyle(ri) : {};
        const ry = y + hdrH + ri * rowH;
        return (
          <g key={ri} opacity={st.opacity ?? 1} transform={`translate(${st.dx ?? 0} 0)`}>
            <rect x={x} y={ry} width={W} height={rowH - 8} rx={12} fill={st.fill ?? (ri % 2 ? C.cardDeep : '#243247')} stroke={st.stroke ?? 'none'} strokeWidth={3} />
            {r.map((v, ci) =>
              cols[ci].ar ? (
                <AR key={ci} x={cx(ci) + cols[ci].w / 2} y={ry + rowH / 2 + 6} size={fs + 2} weight={400} fill={st.txt ?? C.text}>{v}</AR>
              ) : (
                <EN key={ci} x={cx(ci) + cols[ci].w / 2} y={ry + rowH / 2 + 4} size={fs - 2} fill={st.txt ?? C.text}>{v}</EN>
              )
            )}
          </g>
        );
      })}
    </g>
  );
};
