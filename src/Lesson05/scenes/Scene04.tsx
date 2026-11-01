import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Arrowed, Header } from '../../components/common';
import { p, lin, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;
type Tok = [string, string];
const ROWS: { label: string; toks: Tok[]; out: string; outLabel: string }[] = [
  { label: 'AT TIME ZONE', toks: [['order_date', C.text], [' AT TIME ZONE ', C.accent], ["'America/New_York'", C.opt]], out: '2026-11-01 03:00:00', outLabel: 'New York' },
  { label: 'EXTRACT', toks: [['EXTRACT', C.accent], ['(', C.text], ['HOUR', C.opt], [' FROM order_date)', C.text]], out: '8', outLabel: 'hour' },
  { label: 'AGE', toks: [['AGE', C.accent], ['(delivery_date, order_date)', C.text]], out: '2 days 04:30:00', outLabel: 'INTERVAL' },
  { label: 'DATE_TRUNC', toks: [['DATE_TRUNC', C.accent], ["('day', order_date)", C.text]], out: '2026-11-01 00:00:00', outLabel: 'day start' },
];
const RY = (i: number) => 270 + i * 160;

export const Scene04: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Header t={t} a={125.3} b={130.8} ar="أدوات المعالجة الزمنية" en="Time functions in SQL" y={100} />
    <Reveal t={t} at={T.open} dy={24}>
      <Card x={80} y={230} w={1040} h={4 * 160 + 20} stroke={C.client} glow={0.5} r={24} />
      <circle cx={120} cy={262} r={7} fill={C.accent} />
      <circle cx={146} cy={262} r={7} fill={C.opt} />
      <circle cx={172} cy={262} r={7} fill={C.db} />
      <EN x={1090} y={270} size={22} anchor="end" fill={C.muted}>time_functions.sql</EN>
    </Reveal>

    {ROWS.map((r, i) => {
      const full = r.toks.map((x) => x[0]).join('').length;
      let left = Math.floor(lin(t, T.codes[i], T.typeDur[i]) * full);
      const out = p(t, T.outs[i], 0.6);
      const y = RY(i);
      const typingNow = t >= T.codes[i] && t < T.codes[i] + T.typeDur[i];
      return (
        <g key={i}>
          <Reveal t={t} at={T.open + 0.3 + i * 0.15} dy={16}>
            <rect x={104} y={y + 18} width={992} height={112} rx={16} fill={C.cardDeep} stroke={typingNow ? C.client : 'none'} strokeWidth={3} />
            <EN x={124} y={y + 46} size={20} anchor="start" fill={C.muted}>{r.label}</EN>
            <text x={124} y={y + 104} fontFamily={FONT_MONO} fontSize={34} fontWeight={600} direction="ltr">
              {r.toks.map(([s, c], k) => {
                const n = Math.max(0, Math.min(s.length, left));
                left -= n;
                return <tspan key={k} fill={c} xmlSpace="preserve">{s.slice(0, n)}</tspan>;
              })}
            </text>
          </Reveal>
          {/* output card */}
          <g opacity={out} transform={`translate(${(1 - out) * 50} 0)`}>
            <path d={`M 1130 ${y + 74} H 1180`} stroke={C.db} strokeWidth={4} strokeLinecap="round" />
            <rect x={1190} y={y + 18} width={640} height={112} rx={16} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={3} />
            <EN x={1214} y={y + 50} size={20} anchor="start" fill={C.db}>{r.outLabel}</EN>
            <EN x={1510} y={y + 108} size={i === 2 ? 40 : 44} fill={C.db} weight={600}>{r.out}</EN>
          </g>
        </g>
      );
    })}

    <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
      <Arrowed y={975} left="order_date AT TIME ZONE 'UTC'" right="Dynamic Zone Conversion" leftColor={C.opt} rightColor={C.db} size={34} />
    </g>
    <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
      <Arrowed y={975} left="EXTRACT(MONTH FROM date) & AGE()" right="Date Interval Math" leftColor={C.opt} rightColor={C.db} size={34} />
    </g>
  </g>
);
