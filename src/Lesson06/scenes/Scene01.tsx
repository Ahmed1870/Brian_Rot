import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, MiniTable, KeyIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s1;
const CUST_COLS: Col[] = [
  { k: 'customer_id', w: 220, color: C.db },
  { k: 'name', w: 340, ar: true },
];
const ORD_COLS: Col[] = [
  { k: 'order_id', w: 200 },
  { k: 'customer_id', w: 260, color: C.opt },
  { k: 'amount', w: 250 },
];
const CUST = [['1', 'أحمد محمود'], ['2', 'سارة علي'], ['3', 'خالد حسن'], ['4', 'منى سمير']];
const ORD = [['9001', '1', '420'], ['9002', '999', '310'], ['9003', '3', '95'], ['9004', '417', '1,200'], ['9005', '850', '230'], ['9006', '2', '180'], ['9007', '612', '75']];
const ORPHAN = new Set([1, 3, 4, 6]);
const CX = 100, OX = 1030, TY = 300;
const RH = 62;

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tablesAt, 0.9);
  const red = p(t, T.redAt, 0.8);
  const search = lin(t, T.searchAt, 5.5);
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  const chipsOut = 1 - lin(t, T.chipsEnd, 0.5);
  const chips = [
    { at: T.chips[0], ar: 'تقارير شحن مضللة', c: C.accent },
    { at: T.chips[1], ar: 'خسائر لوجستية', c: C.opt },
    { at: T.chips[2], ar: 'اتساق مفقود', c: C.accent },
  ];

  return (
    <g>
      <Header t={t} a={T.header[0]} b={T.header[1]} ar="البيانات اليتيمة" en="Orphaned Records Chaos" color={C.accent} />

      {/* customers */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={CX - 24} y={TY - 70} w={604} h={56 + 4 * RH + 90} stroke={C.db} glow={0.5} r={24} />
        <EN x={CX} y={TY - 28} size={28} anchor="start" fill={C.db} weight={600}>customers</EN>
        <MiniTable x={CX} y={TY} cols={CUST_COLS} rows={CUST} rowH={RH} />
        <EN x={CX + 280} y={TY + 56 + 4 * RH + 34} size={22} fill={C.muted}>4 valid customers</EN>
      </g>

      {/* orders */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={OX - 24} y={TY - 70} w={754} h={56 + 7 * RH + 96} stroke={C.opt} glow={0.5} r={24} />
        <EN x={OX} y={TY - 28} size={28} anchor="start" fill={C.opt} weight={600}>orders</EN>
        <MiniTable
          x={OX}
          y={TY}
          cols={ORD_COLS}
          rows={ORD}
          rowH={RH}
          rowStyle={(i) => {
            const o = ORPHAN.has(i);
            return {
              fill: o && red > 0 ? '#3A2030' : undefined,
              stroke: o && red > 0 ? C.accent : undefined,
              dx: o && t > T.redAt && t < T.redAt + 14 ? Math.sin(t * 40 + i) * 4 * red : 0,
              txt: o && red > 0 ? '#FCA5A5' : undefined,
            };
          }}
        />
      </g>

      {/* broken search arrows from orphan rows toward customers */}
      {[1, 3, 4, 6].map((ri, n) => {
        const y = TY + 56 + ri * RH + (RH - 8) / 2;
        const k2 = lin(t, T.searchAt + n * 0.5, 2.4);
        if (k2 <= 0) return null;
        const reach = 250 * Math.min(1, k2 * 1.15);
        const x0 = OX - 8, wob = Math.sin(t * 14 + n) * 6;
        const fade = 1 - lin(t, T.searchAt + n * 0.5 + 2.2, 1.2);
        return (
          <g key={ri} opacity={fade}>
            <path d={`M ${x0} ${y} C ${x0 - reach * 0.3} ${y + wob} ${x0 - reach * 0.6} ${y - wob} ${x0 - reach} ${y}`} stroke={C.accent} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-t * 80} strokeLinecap="round" fill="none" />
            <circle cx={x0 - reach} cy={y} r={7} fill={C.accent} opacity={0.5 + 0.5 * pulse} />
            {k2 > 0.9 && <EN x={x0 - reach - 14} y={y + 8} size={22} anchor="end" fill={C.accent}>?</EN>}
          </g>
        );
      })}

      {/* warning icon in the gap */}
      <g opacity={p(t, T.alarmAt + 1.2, 0.5) * (1 - lin(t, 30, 0.6))} transform={`translate(815 ${540 - 12 * pulse})`}>
        <path d="M 0 -48 L 54 44 H -54 Z" fill={C.accent} fillOpacity={0.25} stroke={C.accent} strokeWidth={7} strokeLinejoin="round" />
        <path d="M 0 -14 V 16" stroke={C.text} strokeWidth={8} strokeLinecap="round" />
        <circle cx={0} cy={32} r={5} fill={C.text} />
      </g>

      {/* consequence chips */}
      <g opacity={chipsOut}>
        {chips.map((c, i) => {
          const kk = p(t, c.at, 0.5);
          const x = 480 + i * 480;
          return (
            <g key={i} opacity={kk} transform={`translate(0 ${(1 - kk) * 20})`}>
              <rect x={x - 200} y={860} width={400} height={74} rx={37} fill={c.c} opacity={0.16} stroke={c.c} strokeWidth={3} />
              <AR x={x} y={910} size={34} fill={c.c === C.opt ? '#FCD34D' : '#FCA5A5'}>{c.ar}</AR>
            </g>
          );
        })}
      </g>

      {/* teaser: referential integrity */}
      <Reveal t={t} at={T.teaserAt} until={38.7} dy={20}>
        <rect x={470} y={852} width={980} height={92} rx={46} fill={C.client} opacity={0.14} stroke={C.client} strokeWidth={3} />
        <KeyIcon x={560} y={898} s={0.7} color={C.client} />
        <AR x={1400} y={915} size={36} anchor="start" fill={C.client}>السلامة المرجعية</AR>
        <EN x={800} y={908} size={30} anchor="start" fill={C.client} weight={600}>Referential Integrity</EN>
      </Reveal>

      {/* broken link caption */}
      <g opacity={win(t, T.caption[0], T.caption[1], 0.4)}>
        <EN x={520} y={990} size={36} anchor="start" fill={C.opt} weight={600}>orders.customer_id</EN>
        <path d="M 1000 976 H 1090" stroke={C.accent} strokeWidth={5} strokeLinecap="round" />
        <path d="M 1018 954 L 1062 998 M 1062 954 L 1018 998" stroke={C.accent} strokeWidth={7} strokeLinecap="round" />
        <path d="M 1120 976 H 1170" stroke={C.accent} strokeWidth={5} strokeLinecap="round" />
        <path d="M 1158 960 L 1190 976 L 1158 992 Z" fill={C.accent} />
        <EN x={1210} y={990} size={36} anchor="start" fill="#FCA5A5" weight={600}>[No Matching Customer]</EN>
      </g>
    </g>
  );
};
