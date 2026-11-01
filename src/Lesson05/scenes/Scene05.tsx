import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Arrowed, Header } from '../../components/common';
import { p, lin, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s5;
const DAYS = ['Oct 31', 'Nov 1', 'Nov 2'];
const TRUE = [42, 58, 51];
const LATE = 9; // late New York orders (11 PM) in $k
const WRONG = [42, 58 + LATE, 51 - LATE];
const BASE = 760, SCALE = 4.2, BW = 120;

const Panel: React.FC<{ x: number; title: string; color: string; vals: number[]; t: number; at: number; wrong?: boolean; shift: number }> = ({ x, title, color, vals, t, at, wrong, shift }) => {
  const k = p(t, at, 1.2);
  const bx = (i: number) => x + 110 + i * 190;
  return (
    <g>
      <Card x={x} y={250} w={780} h={560} stroke={color} glow={0.5} />
      <EN x={x + 390} y={306} size={30} fill={color} weight={600}>{title}</EN>
      <path d={`M ${x + 50} ${BASE} H ${x + 730}`} stroke={C.line} strokeWidth={3} />
      {vals.map((v, i) => {
        const h = v * SCALE * k;
        const isLateDay = wrong && i === 1;
        const isLostDay = wrong && i === 2;
        return (
          <g key={i}>
            <rect x={bx(i)} y={BASE - h} width={BW} height={h} rx={10} fill={color} opacity={isLostDay ? 0.5 : 0.85} />
            {isLateDay && (
              <rect x={bx(i)} y={BASE - h} width={BW} height={LATE * SCALE * k * shift} rx={10} fill={C.accent} />
            )}
            {isLostDay && (
              <rect x={bx(i)} y={BASE - TRUE[2] * SCALE} width={BW} height={LATE * SCALE * k * shift} rx={10} fill="none" stroke={C.accent} strokeWidth={4} strokeDasharray="10 8" />
            )}
            <EN x={bx(i) + BW / 2} y={BASE + 38} size={24} fill={C.muted}>{DAYS[i]}</EN>
            <EN x={bx(i) + BW / 2} y={BASE - h - 16} size={26} fill={C.text} weight={600} opacity={k}>{`$${Math.round(v)}k`}</EN>
          </g>
        );
      })}
    </g>
  );
};

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const shift = p(t, T.lateAt, 1.2);
  const shiftBars = p(t, T.shiftAt, 1.0);
  const wrongVals = [WRONG[0], TRUE[1] + LATE * shiftBars, TRUE[2] - LATE * shiftBars];
  const rightK = p(t, T.rightAt, 0.8);
  const audit = p(t, T.shiftAt + 0.4, 0.5);

  return (
    <g>
      <Header t={t} a={T.head} b={172} ar="التجميع بـ GROUP BY" en="Financial day alignment" y={110} color={C.client} />

      <Reveal t={t} at={T.wrongAt - 0.3} dy={24}>
        <Panel x={90} title="TIMESTAMP · GROUP BY day" color={C.accent} vals={wrongVals} t={t} at={T.wrongAt} wrong shift={shiftBars} />
      </Reveal>
      <Reveal t={t} at={T.wrongAt - 0.3} dy={24}>
        <g opacity={0.3 + 0.7 * rightK}>
        <Panel x={1050} title="TIMESTAMPTZ · GROUP BY day" color={C.db} vals={TRUE} t={t} at={T.rightAt} shift={0} />
        </g>
      </Reveal>

      {/* late NY order callout */}
      <Reveal t={t} at={T.lateAt} until={T.rightAt - 0.5} dy={14}>
        <rect x={130} y={330} width={700} height={104} rx={20} fill={C.cardDeep} stroke={C.accent} strokeWidth={3} />
        <EN x={160} y={372} size={24} anchor="start" fill="#FCA5A5">New York · 11:00 PM · Oct 31 → Nov 1 bucket</EN>
        <EN x={160} y={412} size={24} anchor="start" fill={C.muted}>Cairo: Nov 2 · 05:00 AM</EN>
      </Reveal>
      <g opacity={audit * (1 - lin(t, T.rightAt - 0.5, 0.5))}>
        <rect x={420} y={832} width={420} height={56} rx={28} fill={C.accent} opacity={0.2} stroke={C.accent} strokeWidth={3} />
        <EN x={630} y={870} size={24} fill="#FCA5A5" weight={600}>⚠ Audit Warning: totals mismatch</EN>
      </g>
      <g opacity={rightK}>
        <rect x={1260} y={832} width={360} height={56} rx={28} fill={C.db} opacity={0.2} stroke={C.db} strokeWidth={3} />
        <EN x={1440} y={870} size={24} fill={C.db} weight={600}>✓ 100% Match</EN>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={975} left="TIMESTAMP Trap" right="Orders Shifted to Wrong Financial Day" leftColor={C.accent} rightColor={C.text} size={34} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={975} left="TIMESTAMPTZ Grouping" right="Perfect Financial Day Alignment" leftColor={C.db} rightColor={C.text} size={34} />
      </g>
    </g>
  );
};
