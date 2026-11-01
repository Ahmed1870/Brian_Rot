import React from 'react';
import { C } from '../../theme';
import { EN, Reveal, Scaled, Card, Header } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const NW = 360, NH = 300, NY = 330, NX = (i: number) => 120 + i * 440;
const CAPTIONS = [
  ['1. Parser & Analyzer', '(Syntax & Semantic Check)'],
  ['2. Query Optimizer', '(Execution Tree & Cost Calc)'],
  ['3. Shared Buffers', '(RAM In-Memory Cache)'],
  ['4. Disk Storage & WAL', '(Persistent Log)'],
];
const NODE_META = [
  { name: 'Parser & Analyzer', sub: 'Validation', color: C.client },
  { name: 'Query Optimizer', sub: 'Execution tree & Cost', color: C.opt },
  { name: 'Shared Buffers', sub: 'RAM · in-memory cache', color: C.db },
  { name: 'Disk Storage & WAL', sub: 'Persistent log', color: C.accent },
];

const Icon: React.FC<{ i: number; cx: number; cy: number; color: string; t: number }> = ({ i, cx, cy, color, t }) => {
  if (i === 0)
    return (
      <g stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={`M ${cx - 40} ${cy - 30} L ${cx - 70} ${cy} L ${cx - 40} ${cy + 30}`} />
        <path d={`M ${cx + 40} ${cy - 30} L ${cx + 70} ${cy} L ${cx + 40} ${cy + 30}`} />
        <path d={`M ${cx - 18} ${cy + 2} L ${cx - 4} ${cy + 18} L ${cx + 22} ${cy - 16}`} />
      </g>
    );
  if (i === 1)
    return (
      <g stroke={color} strokeWidth={5} fill="none" strokeLinecap="round">
        <path d={`M ${cx} ${cy - 30} L ${cx - 50} ${cy + 20} M ${cx} ${cy - 30} L ${cx} ${cy + 20} M ${cx} ${cy - 30} L ${cx + 50} ${cy + 20}`} />
        <circle cx={cx} cy={cy - 34} r={12} fill={C.cardDeep} />
        {[-50, 0, 50].map((dx) => (
          <circle key={dx} cx={cx + dx} cy={cy + 28} r={11} fill={dx === 50 ? color : C.cardDeep} />
        ))}
      </g>
    );
  if (i === 2)
    return (
      <g stroke={color} strokeWidth={5} fill="none" strokeLinecap="round">
        <rect x={cx - 66} y={cy - 28} width={132} height={56} rx={10} />
        {[-44, -22, 0, 22, 44].map((dx) => (
          <path key={dx} d={`M ${cx + dx} ${cy - 28} V ${cy - 44} M ${cx + dx} ${cy + 28} V ${cy + 44}`} />
        ))}
        <rect x={cx - 40} y={cy - 12} width={80 * (0.5 + 0.5 * Math.sin(t * 3))} height={24} rx={6} fill={color} stroke="none" opacity={0.8} />
      </g>
    );
  return (
    <g stroke={color} strokeWidth={5} fill="none" strokeLinecap="round">
      <ellipse cx={cx - 30} cy={cy - 30} rx={40} ry={12} />
      <path d={`M ${cx - 70} ${cy - 30} V ${cy + 24} C ${cx - 70} ${cy + 40} ${cx + 10} ${cy + 40} ${cx + 10} ${cy + 24} V ${cy - 30}`} />
      <path d={`M ${cx + 34} ${cy - 24} H ${cx + 72} M ${cx + 34} ${cy} H ${cx + 72} M ${cx + 34} ${cy + 24} H ${cx + 72}`} />
    </g>
  );
};

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const starts = T.nodes;
  const active = starts.reduce((a, s, i) => (t >= s ? i : a), -1);
  const allLit = t >= T.allLit;
  const centers = starts.map((_, i) => NX(i) + NW / 2);
  const dotX = keys(t, starts, centers);
  const dotOn = t >= starts[0] - 0.4 && t < T.allLit + 3;

  return (
    <g>
      <Header t={t} a={T.intro[0]} b={T.intro[1]} ar="محرك PostgreSQL" en="PostgreSQL Engine Core Schematic" y={140} color={C.db} />

      {/* connectors */}
      {[0, 1, 2].map((i) => {
        const x1 = NX(i) + NW;
        const x2 = NX(i + 1);
        const lit = active > i || allLit;
        const k = p(t, T.reveal + i * 0.4, 0.5);
        return (
          <g key={i} opacity={k}>
            <path d={`M ${x1 + 6} 480 H ${x2 - 14}`} stroke={lit ? C.opt : C.line} strokeWidth={5} strokeLinecap="round" strokeDasharray={lit ? '12 14' : '0'} strokeDashoffset={-t * 60} />
            <path d={`M ${x2 - 30} 464 L ${x2 - 6} 480 L ${x2 - 30} 496 Z`} fill={lit ? C.opt : C.line} />
          </g>
        );
      })}

      {/* nodes */}
      {NODE_META.map((n, i) => {
        const x = NX(i);
        const k = p(t, T.reveal + i * 0.4, 0.6);
        const on = allLit || active === i;
        const reached = active >= i;
        const dim = active >= 0 && !on ? 0.4 : 1;
        const s = on && !allLit ? 1 + 0.04 * p(t, starts[i], 0.5) : 1;
        return (
          <g key={i} opacity={k * dim} transform={`translate(0 ${(1 - k) * 30})`}>
            <Scaled cx={x + NW / 2} cy={NY + NH / 2} s={s}>
              <Card x={x} y={NY} w={NW} h={NH} stroke={on || reached ? n.color : C.line} glow={on ? 1 : 0} />
              <Icon i={i} cx={x + NW / 2} cy={NY + 105} color={n.color} t={t} />
              <EN x={x + NW / 2} y={NY + 220} size={29} weight={600}>{n.name}</EN>
              <EN x={x + NW / 2} y={NY + 262} size={22} fill={C.muted}>{n.sub}</EN>
            </Scaled>
          </g>
        );
      })}

      {/* query particle */}
      {dotOn && (
        <g opacity={win(t, starts[0] - 0.4, T.allLit + 3, 0.4)}>
          <circle cx={dotX} cy={480} r={26} fill={C.opt} opacity={0.2} />
          <circle cx={dotX} cy={480} r={12} fill={C.opt} />
        </g>
      )}

      {/* live captions */}
      {CAPTIONS.map((c, i) => {
        const a = starts[i];
        const b = i < 3 ? starts[i + 1] : T.end;
        return (
          <Reveal key={i} t={t} at={a} until={b + 0.3} dy={18}>
            <EN x={960} y={860} size={48} weight={600} fill={NODE_META[i].color}>{c[0]}</EN>
            <EN x={960} y={915} size={32} fill={C.muted}>{c[1]}</EN>
          </Reveal>
        );
      })}
    </g>
  );
};
