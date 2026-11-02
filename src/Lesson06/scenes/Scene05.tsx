import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s5;
type Tok = [string, string];
const LINES: Tok[][] = [
  [['SELECT ', C.accent], ['c.name, o.order_id, o.amount', C.text]],
  [['FROM ', C.accent], ['customers c', C.client]],
  [['JOIN ', C.accent], ['orders o', C.opt]],
  [['  ON ', C.accent], ['c.customer_id = o.customer_id;', C.text]],
];
const RES_COLS: Col[] = [{ k: 'name', w: 210, ar: true }, { k: 'order_id', w: 150 }, { k: 'amount', w: 150 }];
const RES = [['أحمد محمود', '5001', '420'], ['سارة علي', '5002', '180'], ['سارة علي', '5003', '95'], ['خالد حسن', '5004', '310']];
const GOLD = '#FBBF24';

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const total = LINES.reduce((a, l) => a + l.map((q) => q[0]).join('').length, 0);
  let left = Math.floor(lin(t, T.typeAt[0], T.typeAt[1] - T.typeAt[0]) * total);
  const idx = p(t, T.indexAt, 0.6);
  const flow = lin(t, T.indexAt + 0.3, 2.4);
  const resK = p(t, T.resultAt, 0.5);
  const speed = lin(t, T.resultAt, 1.2);
  const timer = (0.002 * Math.min(1, speed)).toFixed(3);
  const doc = p(t, T.docAt, 0.7);
  const stamp = p(t, T.stampAt, 0.28);
  const stampSc = 1 + (1 - stamp) * 0.9;
  const closing = p(t, T.closing, 0.8);

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="قوة المفاتيح في الشركات" en="Enterprise Value & Query Speed" y={110} color={C.db} />

      {/* query window */}
      <Reveal t={t} at={T.head[0] + 0.4} dy={24}>
        <Card x={90} y={230} w={900} h={290} stroke={C.client} glow={0.5} r={24} />
        <circle cx={130} cy={262} r={7} fill={C.accent} />
        <circle cx={156} cy={262} r={7} fill={C.opt} />
        <circle cx={182} cy={262} r={7} fill={C.db} />
        {LINES.map((ln, li) => (
          <text key={li} x={130} y={330 + li * 52} fontFamily={FONT_MONO} fontSize={31} fontWeight={600} direction="ltr">
            {ln.map(([s, c], i) => {
              const n = Math.max(0, Math.min(s.length, left));
              left -= n;
              return <tspan key={i} fill={c} xmlSpace="preserve">{s.slice(0, n)}</tspan>;
            })}
          </text>
        ))}
      </Reveal>

      {/* indexed tables */}
      <Reveal t={t} at={T.head[0] + 0.8} dy={24}>
        <Card x={90} y={560} w={900} h={320} stroke={C.line} r={24} />
        {[
          { x: 130, name: 'customers', idx: 'customers_pkey', c: C.db },
          { x: 560, name: 'orders', idx: 'idx_orders_customer_id', c: C.opt },
        ].map((tb, i) => (
          <g key={tb.name}>
            <rect x={tb.x} y={596} width={400} height={250} rx={18} fill={C.cardDeep} stroke={idx > 0.2 ? C.db : C.line} strokeWidth={idx > 0.2 ? 4 : 2} />
            <EN x={tb.x + 24} y={640} size={28} anchor="start" fill={tb.c} weight={600}>{tb.name}</EN>
            {[0, 1, 2, 3].map((r) => (
              <rect key={r} x={tb.x + 24} y={664 + r * 34} width={352} height={22} rx={6} fill={C.line} opacity={0.5} />
            ))}
            <g opacity={idx} transform={`translate(0 ${(1 - idx) * 10})`}>
              <rect x={tb.x + 24} y={808 - 6} width={352} height={34} rx={17} fill={C.db} opacity={0.2} stroke={C.db} strokeWidth={2} />
              <EN x={tb.x + 200} y={808 + 18} size={18} fill={C.db} weight={600}>{`⚡ ${tb.idx}`}</EN>
            </g>
          </g>
        ))}
        <g opacity={idx}>
          <path d="M 530 720 H 560" stroke={C.db} strokeWidth={6} strokeLinecap="round" />
          {flow < 1 && <circle cx={530 + 30 * flow} cy={720} r={8} fill={C.text} />}
        </g>
      </Reveal>

      {/* result + timer */}
      <Reveal t={t} at={T.head[0] + 0.6} dy={24}>
        <Card x={1030} y={230} w={800} h={290} stroke={C.line} glow={resK * 0.8} r={24} />
        <EN x={1062} y={272} size={22} anchor="start" fill={C.muted}>result</EN>
        <MiniTable x={1060} y={290} cols={RES_COLS} rows={RES} rowH={44} hdrH={42} fs={22}
          rowStyle={(i) => ({ opacity: p(t, T.resultAt + i * 0.18, 0.35), dx: (1 - p(t, T.resultAt + i * 0.18, 0.35)) * -70, stroke: resK > 0.5 ? C.db : undefined })} />
        <g opacity={resK} transform={`translate(1690 ${290 + 24})`}>
          <rect x={-90} y={0} width={170} height={130} rx={20} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
          <EN x={-5} y={64} size={36} fill={C.db} weight={600}>{timer}</EN>
          <EN x={-5} y={102} size={24} fill={C.db}>sec</EN>
        </g>
      </Reveal>

      {/* audit document with integrity stamp */}
      <Reveal t={t} at={T.docAt} dy={30}>
        <Card x={1030} y={560} w={800} h={320} stroke={GOLD} glow={0.5} r={24} fill="#1B2740" />
        <EN x={1062} y={604} size={24} anchor="start" fill={GOLD} weight={600}>Sales ↔ Shipments · Reconciliation</EN>
        {[
          ['9001  Customer #1', '420.00', '✓'],
          ['9002  Customer #2', '180.00', '✓'],
          ['9003  Customer #3', '310.00', '✓'],
        ].map((r, i) => {
          const k = p(t, T.docAt + 0.4 + i * 0.35, 0.4);
          return (
            <g key={i} opacity={k}>
              <rect x={1062} y={626 + i * 56} width={540} height={46} rx={10} fill={C.cardDeep} />
              <EN x={1082} y={657 + i * 56} size={22} anchor="start">{r[0]}</EN>
              <EN x={1500} y={657 + i * 56} size={22} anchor="end" fill={C.muted}>{r[1]}</EN>
              <EN x={1580} y={659 + i * 56} size={26} anchor="end" fill={C.db} weight={600}>{r[2]}</EN>
            </g>
          );
        })}
        <g opacity={stamp} transform={`translate(1712 735) rotate(-12) scale(${stampSc})`}>
          <circle r={70} fill="none" stroke={C.db} strokeWidth={6} />
          <circle r={60} fill="none" stroke={C.db} strokeWidth={2} />
          <EN x={0} y={-6} size={30} fill={C.db} weight={600}>100%</EN>
          <EN x={0} y={24} size={15} fill={C.db} weight={600}>DATA INTEGRITY</EN>
        </g>
      </Reveal>

      <g opacity={closing} transform={`translate(0 ${(1 - closing) * 14})`}>
        <AR x={960} y={940} size={38} weight={700}>البنية التحتية الصلبة للتقارير الاستراتيجية</AR>
      </g>

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={1000} left="Indexed FK Joins" right="Lightning Fast Query Execution (0.002s)" leftColor={C.db} rightColor={C.text} size={32} />
      </g>
      <g opacity={win(t, T.cap2[0], 204.4, 0.4)}>
        <Arrowed y={1000} left="100% Data Integrity" right="Reliable Enterprise Reporting" leftColor={C.db} rightColor={C.text} size={32} />
      </g>
    </g>
  );
};
