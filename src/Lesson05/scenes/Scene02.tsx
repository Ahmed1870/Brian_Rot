import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Arrowed } from '../../components/common';
import { p, lin, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const R = 150;

const Clock: React.FC<{ cx: number; cy: number; color: string; h: number; m: number }> = ({ cx, cy, color, h, m }) => (
  <g>
    <circle cx={cx} cy={cy} r={R} fill={C.cardDeep} stroke={color} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M ${cx} ${cy - R + 10} V ${cy - R + (i % 3 === 0 ? 34 : 22)}`} stroke={color} strokeWidth={i % 3 === 0 ? 6 : 3} transform={`rotate(${i * 30} ${cx} ${cy})`} opacity={0.8} />
    ))}
    <path d={`M ${cx} ${cy} V ${cy - 84}`} stroke={C.text} strokeWidth={9} strokeLinecap="round" transform={`rotate(${h} ${cx} ${cy})`} />
    <path d={`M ${cx} ${cy} V ${cy - 120}`} stroke={color} strokeWidth={6} strokeLinecap="round" transform={`rotate(${m} ${cx} ${cy})`} />
    <circle cx={cx} cy={cy} r={10} fill={color} />
  </g>
);

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.intro, 0.8);
  const lActive = win(t, T.left[0] - 0.4, 80, 0.4);
  // erratic hands on the left (blind clock)
  const lh = 40 * Math.sin(t * 2.3) + 120 * Math.sin(t * 0.7) + t * 25;
  const lm = 200 * Math.sin(t * 3.1) + t * 140;
  // steady, anchored hands on the right: 10:00 (+02:00)
  const rh = 300, rm = 0;
  const anchor = p(t, T.anchorAt, 0.8);
  const bytes = p(t, T.bytesAt, 0.6);
  const unsafe = p(t, T.unsafeAt, 0.5);
  const safe = p(t, T.safeAt, 0.6);
  const LX = 510, RX = 1410, CY = 520;

  return (
    <g>
      {/* intro title */}
      <Reveal t={t} at={T.intro} until={47.2} dy={16}>
        <AR x={960} y={140} size={60} weight={900}>نوعان للتواريخ في PostgreSQL</AR>
        <EN x={960} y={196} size={32} fill={C.client} weight={600}>TIMESTAMP vs TIMESTAMPTZ</EN>
      </Reveal>

      {/* left panel */}
      <g opacity={k * (t < T.left[0] ? 0.6 : 1)}>
        <Card x={90} y={250} w={840} h={560} stroke={t >= T.left[0] ? C.accent : C.line} glow={t >= T.left[0] && t < T.right[0] ? 0.9 : 0} />
        <EN x={LX} y={310} size={36} fill={C.accent} weight={600}>TIMESTAMP</EN>
        <Clock cx={LX} cy={CY} color={C.accent} h={t >= T.left[0] ? lh : 300} m={t >= T.left[0] ? lm : 0} />
        <EN x={LX} y={745} size={30} fill={C.text}>2026-11-01 10:00:00</EN>
        <EN x={LX} y={785} size={22} fill={C.muted}>no timezone offset</EN>
        <g opacity={unsafe * (1 - safe * 0.0)}>
          <rect x={LX + 170} y={290} width={150} height={44} rx={22} fill={C.accent} opacity={0.2} stroke={C.accent} strokeWidth={2} />
          <EN x={LX + 245} y={321} size={22} fill="#FCA5A5" weight={600}>✗ unsafe</EN>
        </g>
      </g>

      {/* right panel */}
      <g opacity={k * (t < T.right[0] ? 0.6 : 1)}>
        <Card x={990} y={250} w={840} h={560} stroke={t >= T.right[0] ? C.db : C.line} glow={t >= T.right[0] ? 0.9 : 0} />
        <EN x={RX} y={310} size={36} fill={C.db} weight={600}>TIMESTAMPTZ</EN>
        <Clock cx={RX} cy={CY} color={C.db} h={rh} m={rm} />
        {/* UTC anchor axis */}
        <g opacity={anchor}>
          <path d={`M ${RX} ${CY - R - 16} V 330`} stroke={C.db} strokeWidth={5} strokeDasharray="8 8" />
          <rect x={RX - 56} y={326} width={112} height={42} rx={21} fill={C.db} opacity={0.25} stroke={C.db} strokeWidth={2} />
          <EN x={RX} y={356} size={22} fill={C.db} weight={600}>UTC</EN>
          <rect x={RX + R + 14} y={CY - 24} width={104} height={44} rx={22} fill={C.opt} opacity={0.25} stroke={C.opt} strokeWidth={2} />
          <EN x={RX + R + 66} y={CY + 7} size={22} fill={C.opt} weight={600}>+02:00</EN>
        </g>
        <EN x={RX} y={745} size={30} fill={C.text}>2026-11-01 10:00:00+02:00</EN>
        <EN x={RX} y={785} size={22} fill={C.muted}>stored as 08:00:00 UTC</EN>
        <g opacity={safe}>
          <rect x={RX + 160} y={290} width={150} height={44} rx={22} fill={C.db} opacity={0.2} stroke={C.db} strokeWidth={2} />
          <EN x={RX + 235} y={321} size={22} fill={C.db} weight={600}>✓ safe</EN>
        </g>
      </g>

      {/* 8 bytes arrow between the panels */}
      <g opacity={bytes}>
        <path d={`M ${LX + 200} 840 H ${RX - 200}`} stroke={C.opt} strokeWidth={5} strokeLinecap="round" />
        <path d={`M ${LX + 214} 824 L ${LX + 180} 840 L ${LX + 214} 856 Z`} fill={C.opt} />
        <path d={`M ${RX - 214} 824 L ${RX - 180} 840 L ${RX - 214} 856 Z`} fill={C.opt} />
        <rect x={810} y={812} width={300} height={56} rx={28} fill={C.cardDeep} stroke={C.opt} strokeWidth={3} />
        <EN x={960} y={850} size={28} fill={C.opt} weight={600}>both = 8 bytes</EN>
      </g>

      {/* captions */}
      <g opacity={win(t, T.left[0], T.left[1], 0.4)}>
        <Arrowed y={960} left="TIMESTAMP" right="Blind Wall Clock (No Timezone Offset)" leftColor={C.accent} rightColor={C.text} size={34} />
      </g>
      <g opacity={win(t, T.right[0], T.right[1], 0.4)}>
        <Arrowed y={960} left="TIMESTAMPTZ" right="Universal Time Anchor (UTC Normalized)" leftColor={C.db} rightColor={C.text} size={34} />
      </g>
    </g>
  );
};
