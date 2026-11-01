import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header } from '../../components/common';
import { p, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;
const GOLD = '#FBBF24';
const COLS = [
  { k: 'first_name', v: 'أحمد', ar: true },
  { k: 'last_name', v: 'محمود', ar: true },
  { k: 'phone', v: '01000000001', ar: false },
  { k: 'city', v: 'القاهرة', ar: true },
];
const CW = 330, GAP = 20, X0 = 270, HY = 330, VY = 410;
const cx = (i: number) => X0 + i * (CW + GAP) + CW / 2;

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const messy = 1 - p(t, T.splitAt, 0.5);
  const crack = p(t, T.splitAt, 0.5);
  const done = p(t, T.doneAt, 0.8);
  const orbit = t * 90;

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="قاعدة القيمة الذرية" en="Atomic Value Principle" color={GOLD} />

      {/* messy single cell */}
      <g opacity={messy}>
        <Card x={X0} y={VY - 70} w={4 * CW + 3 * GAP} h={170} stroke={C.accent} fill="#2A2233" r={20} />
        <AR x={960} y={VY + 30} size={50} weight={700} fill="#FCA5A5">أحمد محمود - 01000000001 - القاهرة</AR>
      </g>

      {/* four clean cells */}
      {COLS.map((c, i) => {
        const k = crack;
        const sp = spring({ frame: Math.round((t - (T.land[i] - 0.5)) * fps), fps, config: { stiffness: 150 } });
        const land = t >= T.land[i] - 0.5 ? sp : 0;
        const lit = t >= T.land[i];
        return (
          <g key={c.k} opacity={k}>
            <rect x={cx(i) - CW / 2} y={HY} width={CW} height={64} rx={14} fill={C.client} opacity={0.2} />
            <EN x={cx(i)} y={HY + 40} size={26} fill={C.client} weight={600}>{c.k}</EN>
            <rect x={cx(i) - CW / 2} y={VY} width={CW} height={100} rx={16} fill={C.card} stroke={lit ? C.db : C.line} strokeWidth={4} opacity={1} />
            <g opacity={Math.min(1, land * 1.5)} transform={`translate(${(1 - land) * (960 - cx(i)) * 0.6} ${(1 - land) * 30})`}>
              {c.ar ? <AR x={cx(i)} y={VY + 64} size={40} weight={700} fill={lit ? C.db : C.text}>{c.v}</AR> : <EN x={cx(i)} y={VY + 62} size={32} weight={600} fill={lit ? C.db : C.text}>{c.v}</EN>}
            </g>
          </g>
        );
      })}

      {/* green sweep + atom badge */}
      <g opacity={done}>
        <rect x={X0 - 12} y={HY - 12} width={4 * CW + 3 * GAP + 24} height={VY + 100 - HY + 24} rx={26} fill="none" stroke={C.db} strokeWidth={5} opacity={0.7} />
        <g transform="translate(960 700)">
          <ellipse rx={92} ry={32} fill="none" stroke={C.db} strokeWidth={5} transform={`rotate(${orbit})`} />
          <ellipse rx={92} ry={32} fill="none" stroke={C.db} strokeWidth={5} transform={`rotate(${orbit + 60})`} />
          <ellipse rx={92} ry={32} fill="none" stroke={C.db} strokeWidth={5} transform={`rotate(${orbit + 120})`} />
          <circle r={18} fill={GOLD} />
          <circle r={34} fill={GOLD} opacity={0.2} />
        </g>
        <EN x={960} y={810} size={28} fill={C.db} weight={600}>Atomic Value</EN>
      </g>

      {/* gold rule badge */}
      <Reveal t={t} at={T.ruleAt} until={157.5} dy={20}>
        <rect x={470} y={876} width={980} height={104} rx={52} fill={GOLD} opacity={0.16} stroke={GOLD} strokeWidth={4} />
        <EN x={960} y={942} size={48} fill={GOLD} weight={600}>1 Cell = 1 Indivisible Value</EN>
      </Reveal>
    </g>
  );
};
