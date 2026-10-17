import React from 'react';
import {getLength, getPointAtLength} from '@remotion/paths';
import {C} from '../theme';
import {clamp, sp, SP} from './anim';

/** Monzoma Digital / Gomaa Intelligence mark, redrawn as vector (local box 33..327 x 6..270). */
export const LOGO_CENTER = {x: 180, y: 138};

const CLOUD = 'M150 215 H95 A62 62 0 0 1 95 91 A85 85 0 0 1 265 91 A62 62 0 0 1 265 215 H210';
const CLOUD_LEN = getLength(CLOUD);
const CHART: [number, number][] = [[96, 170], [136, 140], [178, 116], [224, 88], [262, 64]];
const CHART_D = 'M' + CHART.map((p) => p.join(' ')).join(' L');
const CIRCUITS = [
  {d: 'M140 230 H70', n: [62, 230]},
  {d: 'M140 252 H108 L98 262 H52', n: [44, 262]},
];

export type LogoColors = {main: string; bars: string; chart: string; bg: string};
export const LOGO_BRAND: LogoColors = {main: C.blue2, bars: C.cyan, chart: C.gold, bg: C.bg};
export const LOGO_MONO: LogoColors = {main: '#fff', bars: '#fff', chart: '#fff', bg: '#000'};

const pop = (s: number, cx: number, cy: number) =>
  `translate(${cx} ${cy}) scale(${Math.max(0, s)}) translate(${-cx} ${-cy})`;

const Draw: React.FC<{d: string; p: number; w?: number; c: string}> = ({d, p, w = 4, c}) =>
  p <= 0.001 ? null : (
    <path d={d} pathLength={1} fill="none" stroke={c} strokeWidth={w} strokeLinecap="butt" strokeLinejoin="round"
      strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} />
  );

export const LogoMark: React.FC<{f: number; colors?: LogoColors; pulse?: boolean}> = ({f, colors = LOGO_BRAND, pulse = true}) => {
  const S = (cfg: keyof typeof SP, d: number) => sp(f, SP[cfg], d);
  const pt = f > 80 ? ((f - 80) / 96) % 1 : -1;
  const dot = pulse && pt >= 0 ? getPointAtLength(CLOUD, pt * CLOUD_LEN) : null;
  const {main, bars, chart, bg} = colors;
  return (
    <g>
      <Draw d={CLOUD} p={S('soft', 0)} w={5.5} c={main} />
      {[0, 1, 2].map((i) => {
        const y = 200 + i * 22;
        const s = S('bouncy', 14 + i * 6);
        return (
          <g key={i} transform={pop(s, 180, y + 8)} opacity={clamp(s * 4)}>
            <rect x={140} y={y} width={80} height={16} rx={4} fill="none" stroke={main} strokeWidth={3.5} />
            <circle cx={151} cy={y + 8} r={2.6} fill={main} />
            <line x1={176} y1={y + 8} x2={208} y2={y + 8} stroke={main} strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      })}
      {[0, 1, 2].map((i) => {
        const h = 52 + i * 20;
        const s = S('bouncy', 30 + i * 6);
        return (
          <rect key={i} x={146 + i * 28} y={196 - h} width={18} height={h} fill={bars}
            transform={`translate(0 196) scale(1 ${Math.max(0, s)}) translate(0 -196)`} />
        );
      })}
      <Draw d={CHART_D} p={S('soft', 44)} w={3.5} c={chart} />
      {CHART.map(([x, y], i) => (
        <g key={i} transform={pop(S('bouncy', 52 + i * 5), x, y)}>
          <circle cx={x} cy={y} r={6.5} fill={bg} stroke={chart} strokeWidth={3.5} />
        </g>
      ))}
      {[false, true].map((m) =>
        CIRCUITS.map((c, i) => (
          <g key={`${m}${i}`} transform={m ? 'translate(360 0) scale(-1 1)' : undefined}>
            <Draw d={c.d} p={S('soft', 60 + i * 6)} w={3} c={main} />
            <g transform={pop(S('bouncy', 70 + i * 6), c.n[0], c.n[1])}>
              <circle cx={c.n[0]} cy={c.n[1]} r={5} fill={bg} stroke={bars} strokeWidth={3} />
            </g>
          </g>
        )),
      )}
      {dot ? <circle cx={dot.x} cy={dot.y} r={5.5} fill={chart} /> : null}
    </g>
  );
};
