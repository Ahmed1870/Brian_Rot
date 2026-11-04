import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, CodeBlock } from '../../components/common';
import type { Col, Tok } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s2;
const Q: Tok[][] = [[['WHERE EXISTS ', C.accent], ['(', C.text], ['SELECT 1 ', C.opt], ['FROM ', C.accent], ['orders o ', C.client], ['WHERE ', C.accent], ['o.customer_id = c.customer_id', C.text], [')', C.text]]];
const CUST = [['1', 'أحمد'], ['2', 'سارة'], ['3', 'خالد']];
const ORD = [['9001', '2', '320'], ['9002', '5', '90'], ['9003', '1', '540'], ['9004', '1', '75'], ['9005', '2', '410'], ['9006', '4', '60']];
const CCOLS: Col[] = [{ k: 'customer_id', w: 190, color: C.client }, { k: 'name', w: 200, ar: true }];
const OCOLS: Col[] = [{ k: 'order_id', w: 220 }, { k: 'customer_id', w: 260, color: C.client }, { k: 'amount', w: 220 }];
const OX = 760, OY = 404, HDR = 50, RH = 56;
const CXL = 110;

// per-customer scan plan: start time, seconds per row, index of first match (-1 = none)
const PLANS = [
  { at: T.c1, dt: 1.0, hit: 2 },
  { at: T.c2, dt: 1.0, hit: 0 },
  { at: T.c3, dt: 0.45, hit: -1 },
];

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const ed = p(t, T.edAt, 0.8);
  const typed = lin(t, T.typeA[0], T.typeA[1] - T.typeA[0]);
  const vis = win(t, T.variants[0], T.variants[1], 0.5);
  const scan = p(t, T.scanAt, 0.7);
  const hi = win(t, T.hiAt, T.hiAt + 2.4, 0.4);
  // which customer is active and how far the scanner is
  const ci = t >= T.c3 ? 2 : t >= T.c2 ? 1 : t >= T.c1 ? 0 : -1;
  const plan = ci >= 0 ? PLANS[ci] : null;
  const rowsSeen = plan ? Math.floor((t - plan.at) / plan.dt) + 1 : 0;
  const lastRow = plan ? (plan.hit >= 0 ? Math.min(rowsSeen - 1, plan.hit) : Math.min(rowsSeen - 1, 5)) : -1;
  const stopped = plan ? (plan.hit >= 0 ? rowsSeen - 1 >= plan.hit : rowsSeen - 1 >= 5) : false;
  const scanY = (r: number) => OY + HDR + r * RH;
  const summary = p(t, T.summaryAt, 0.6);
  const speed = p(t, T.speedAt, 0.6);
  const scanned = [3, 1, 6];

  return (
    <g>
      <Header t={t} a={41.3} b={45.9} ar="الفحص الوجودي" en="EXISTS Operator" y={105} color={C.db} />

      {/* editor */}
      <g opacity={ed} transform={`translate(0 ${(1 - ed) * 20})`}>
        <Card x={90} y={190} w={1740} h={110} stroke={C.client} glow={0.4} r={22} />
        <CodeBlock lines={Q} x={130} y={258} size={34} progress={typed} />
        <g opacity={hi}><rect x={408} y={222} width={196} height={50} rx={10} fill={C.opt} opacity={0.22} stroke={C.opt} strokeWidth={3} /></g>
      </g>

      {/* values-don't-matter variants */}
      <g opacity={vis}>
        <Card x={90} y={340} w={1740} h={470} stroke={C.line} r={24} />
        <AR x={960} y={410} size={40} weight={900}>EXISTS مابيهتمش بالقيمة المرجعة</AR>
        {['SELECT 1', 'SELECT *', "SELECT 'x'"].map((s, i) => {
          const kk = p(t, T.variants[0] + 1.2 + i * 1.6, 0.5);
          return (
            <g key={s} opacity={kk} transform={`translate(0 ${(1 - kk) * 16})`}>
              <rect x={300} y={470 + i * 100} width={520} height={72} rx={36} fill={C.cardDeep} stroke={C.client} strokeWidth={3} />
              <EN x={560} y={518 + i * 100} size={32} fill={C.client} weight={600}>{s}</EN>
              <path d={`M 840 ${506 + i * 100} H 1080`} stroke={C.opt} strokeWidth={5} strokeLinecap="round" />
              <path d={`M 1064 ${490 + i * 100} L 1096 ${506 + i * 100} L 1064 ${522 + i * 100} Z`} fill={C.opt} />
            </g>
          );
        })}
        <g opacity={p(t, T.variants[0] + 2.0, 0.6)}>
          <rect x={1120} y={500} width={420} height={200} rx={28} fill={C.db} opacity={0.15} stroke={C.db} strokeWidth={4} />
          <EN x={1330} y={582} size={56} fill={C.db} weight={600}>TRUE</EN>
          <EN x={1330} y={640} size={24} fill={C.muted}>row exists?  yes / no</EN>
        </g>
      </g>

      {/* customers + orders scan */}
      <g opacity={scan}>
        <Card x={90} y={340} w={600} h={470} stroke={C.client} glow={0.3} r={24} />
        <EN x={CXL} y={386} size={24} anchor="start" fill={C.client} weight={600}>customers c</EN>
        <MiniTable x={CXL} y={404} cols={CCOLS} rows={CUST} rowH={RH + 14} hdrH={HDR} fs={24}
          rowStyle={(i) => {
            const done = ci > i || (ci === i && stopped);
            const ok = i !== 2;
            return { stroke: ci === i ? (stopped ? (ok ? C.db : C.accent) : C.purple) : undefined, fill: done ? (ok ? '#143B31' : '#3A2030') : undefined };
          }} />
        {[0, 1, 2].map((i) => {
          const done = ci > i || (ci === i && stopped);
          return done ? (
            <g key={i} transform={`translate(${600} ${404 + HDR + i * (RH + 14) + 28})`}>
              <rect x={-60} y={-24} width={130} height={48} rx={24} fill={i !== 2 ? C.db : C.accent} opacity={0.2} stroke={i !== 2 ? C.db : C.accent} strokeWidth={3} />
              <EN x={5} y={8} size={22} fill={i !== 2 ? C.db : '#FCA5A5'} weight={600}>{i !== 2 ? 'TRUE' : 'FALSE'}</EN>
            </g>
          ) : null;
        })}

        <Card x={730} y={340} w={1100} h={470} stroke={C.line} glow={0.3} r={24} />
        <EN x={760} y={386} size={24} anchor="start" fill={C.client} weight={600}>orders o</EN>
        <MiniTable x={OX} y={OY} cols={OCOLS} rows={ORD} rowH={RH} hdrH={HDR} fs={24}
          rowStyle={(r) => {
            if (!plan) return {};
            const seen = r <= lastRow;
            const hit = plan.hit >= 0 && r === plan.hit && stopped;
            const skipped = stopped && plan.hit >= 0 && r > plan.hit;
            return { fill: hit ? '#143B31' : undefined, stroke: hit ? C.db : seen && !stopped ? C.purple : undefined, opacity: skipped ? 0.28 : 1 };
          }} />
        {/* laser scan line */}
        {plan && !stopped && lastRow >= 0 && <rect x={OX} y={scanY(Math.max(0, lastRow)) + 4} width={700} height={8} rx={4} fill={C.purple} opacity={0.9} />}
        {plan && stopped && plan.hit >= 0 && (
          <g transform={`translate(${OX + 730} ${scanY(plan.hit) + 28})`}>
            <rect x={0} y={-24} width={190} height={48} rx={24} fill={C.db} opacity={0.22} stroke={C.db} strokeWidth={3} />
            <EN x={95} y={8} size={22} fill={C.db} weight={600}>⚡ STOP · TRUE</EN>
          </g>
        )}
        {plan && stopped && plan.hit >= 0 && plan.hit < 5 && (
          <EN x={OX + 730} y={scanY(plan.hit + 1) + 28} size={20} anchor="start" fill={C.muted}>skipped</EN>
        )}
      </g>

      {/* early exit summary */}
      <g opacity={summary} transform={`translate(0 ${(1 - summary) * 16})`}>
        <rect x={90} y={850} width={1740} height={84} rx={42} fill={C.db} opacity={0.13} stroke={C.db} strokeWidth={3} />
        <EN x={520} y={902} size={28} fill={C.db} weight={600}>{`rows scanned: ${scanned.join(' · ')}  (of 6)`}</EN>
        <AR x={1760} y={902} size={32} anchor="start" fill={C.db}>التوقف المبكر</AR>
        <g opacity={speed}>
          <EN x={1130} y={902} size={26} fill={C.db} weight={600}>⚡ High Speed Boolean</EN>
        </g>
      </g>

      <g opacity={win(t, T.cap[0], T.cap[1], 0.4)}>
        <Arrowed y={985} left="Short-Circuiting Mechanics" right="Stops Scanning Upon FIRST Matching Row (High Speed)" leftColor={C.db} rightColor={C.text} size={24} />
      </g>
    </g>
  );
};
