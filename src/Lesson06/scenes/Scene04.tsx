import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, ShieldIcon } from '../../components/common';
import type { Col } from '../../components/common';
import { p, lin, win, keys, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;
type Tok = [string, string];
const Q1: Tok[][] = [
  [['INSERT INTO ', C.accent], ['orders', C.client], [' (customer_id)', C.text]],
  [['VALUES ', C.accent], ['(', C.text], ['999', C.opt], [');', C.text]],
];
const Q2: Tok[][] = [
  [['DELETE FROM ', C.accent], ['customers', C.client]],
  [['WHERE ', C.opt], ['customer_id = ', C.text], ['1', C.opt], [';', C.text]],
];
const CUST_COLS: Col[] = [{ k: 'customer_id', w: 200, color: C.db, badge: { t: 'PK', c: C.db } }, { k: 'name', w: 330, ar: true }];
const ORD_COLS: Col[] = [{ k: 'customer_id', w: 200, color: C.opt, badge: { t: 'FK', c: C.opt } }, { k: 'order_id', w: 330 }];
const SHX = 1010, SHY = 400;

const Code: React.FC<{ lines: Tok[][]; prog: number; x: number; y: number }> = ({ lines, prog, x, y }) => {
  const total = lines.reduce((a, l) => a + l.map((q) => q[0]).join('').length, 0);
  let left = Math.floor(prog * total);
  return (
    <g>
      {lines.map((ln, li) => (
        <text key={li} x={x} y={y + li * 60} fontFamily={FONT_MONO} fontSize={36} fontWeight={600} direction="ltr">
          {ln.map(([s, c], i) => {
            const n = Math.max(0, Math.min(s.length, left));
            left -= n;
            return <tspan key={i} fill={c} xmlSpace="preserve">{s.slice(0, n)}</tspan>;
          })}
        </text>
      ))}
    </g>
  );
};

/** query packet flight: editor → shield, bounce back */
const flight = (t: number, run: number, hit: number) => {
  const x = keys(t, [run, hit, hit + 0.9], [840, SHX - 100, 880]);
  const on = t >= run && t < hit + 1.0;
  return { x, on };
};

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const phase2 = t >= T.type2[0] - 0.5;
  const q1 = lin(t, T.type1[0], T.type1[1] - T.type1[0]);
  const q2 = lin(t, T.type2[0], T.type2[1] - T.type2[0]);
  const run1 = p(t, T.runAt, 0.3) * (1 - lin(t, T.runAt + 0.5, 0.3));
  const run2 = p(t, T.run2, 0.3) * (1 - lin(t, T.run2 + 0.5, 0.3));
  const f1 = flight(t, T.runAt + 0.2, T.hitAt);
  const f2 = flight(t, T.run2 + 0.2, T.hitAt + (T.run2 - T.runAt));
  const hit1 = bump(t, T.hitAt, 1.0), hit2 = bump(t, T.run2 + (T.hitAt - T.runAt), 1.0);
  const hit = Math.max(hit1, hit2);
  const e1 = p(t, T.error1, 0.4) * (1 - lin(t, T.type2[0] - 0.4, 0.4));
  const e2 = p(t, T.error2, 0.4);
  const sh1 = t >= T.error1 && t < T.error1 + 1.2 ? Math.sin(t * 60) * 8 * (1 - lin(t, T.error1, 1.2)) : 0;
  const sh2 = t >= T.error2 && t < T.error2 + 1.2 ? Math.sin(t * 60) * 8 * (1 - lin(t, T.error2, 1.2)) : 0;
  const guard = p(t, T.guardAt, 0.8);
  const deleting = t >= T.run2 + 1.5;

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1] + 0.3} ar="حارس سلامة البيانات" en="Constraint Violation Shield" y={110} color={C.accent} />

      {/* query editor */}
      <Reveal t={t} at={T.head[0] + 0.5} dy={24}>
        <Card x={90} y={230} w={780} h={330} stroke={C.client} glow={0.5} r={24} />
        <circle cx={130} cy={262} r={7} fill={C.accent} />
        <circle cx={156} cy={262} r={7} fill={C.opt} />
        <circle cx={182} cy={262} r={7} fill={C.db} />
        <EN x={840} y={270} size={22} anchor="end" fill={C.muted}>query_runner.sql</EN>
        {!phase2 ? <Code lines={Q1} prog={q1} x={130} y={350} /> : <Code lines={Q2} prog={q2} x={130} y={350} />}
        {/* run button */}
        <g transform={`translate(${690} ${470}) scale(${1 - 0.08 * Math.max(run1, run2)})`}>
          <rect x={0} y={0} width={150} height={54} rx={27} fill={C.db} opacity={0.25 + 0.5 * Math.max(run1, run2)} stroke={C.db} strokeWidth={3} />
          <EN x={75} y={36} size={24} fill={C.text} weight={600}>▶ Run</EN>
        </g>
      </Reveal>

      {/* shield */}
      <g transform={`translate(${SHX} ${SHY}) scale(${1 + 0.1 * hit})`}>
        <circle r={150} fill={C.accent} opacity={0.05 + 0.18 * hit} />
        <ShieldIcon x={0} y={0} s={1.25} color={t > T.hitAt ? C.accent : C.client} fillOp={0.16 + 0.3 * hit} />
        <EN x={0} y={14} size={26} fill={C.text} weight={600}>FK</EN>
      </g>
      {[f1, f2].map((f, i) =>
        f.on ? (
          <g key={i}>
            <circle cx={f.x} cy={SHY} r={26} fill={i === 0 ? C.opt : C.accent} opacity={0.22} />
            <circle cx={f.x} cy={SHY} r={13} fill={i === 0 ? C.opt : C.accent} />
          </g>
        ) : null
      )}
      {/* BLOCKED stamps */}
      <g opacity={p(t, T.hitAt, 0.2) * (1 - lin(t, T.type2[0] - 0.5, 0.4))} transform={`translate(${SHX} ${SHY + 176}) rotate(-6)`}>
        <rect x={-150} y={-30} width={300} height={60} rx={14} fill="none" stroke={C.accent} strokeWidth={5} />
        <EN x={0} y={11} size={30} fill={C.accent} weight={600}>BLOCKED</EN>
      </g>
      <g opacity={p(t, T.run2 + (T.hitAt - T.runAt), 0.2)} transform={`translate(${SHX} ${SHY + 176}) rotate(-6)`}>
        <rect x={-150} y={-30} width={300} height={60} rx={14} fill="none" stroke={C.accent} strokeWidth={5} />
        <EN x={0} y={11} size={30} fill={C.accent} weight={600}>PROTECTED</EN>
      </g>

      {/* protected tables on the right */}
      <Reveal t={t} at={T.head[0] + 0.8} dy={24}>
        <Card x={1190} y={230} w={640} h={352} stroke={C.line} r={24} />
        <EN x={1214} y={268} size={22} anchor="start" fill={C.db} weight={600}>customers</EN>
        <MiniTable x={1214} y={282} cols={[{ k: 'customer_id', w: 160, color: C.db }, { k: 'name', w: 260, ar: true }]} rows={[['1', 'أحمد محمود'], ['2', 'سارة علي']]} rowH={52} hdrH={46} fs={22}
          rowStyle={(i) => (i === 0 && deleting ? { stroke: C.accent, fill: '#3A2030' } : {})} />
        <EN x={1214} y={464} size={22} anchor="start" fill={C.opt} weight={600}>orders</EN>
        <MiniTable x={1214} y={474} cols={[{ k: 'customer_id', w: 160, color: C.opt }, { k: 'order_id', w: 260 }]} rows={[['1', '5001']]} rowH={52} hdrH={46} fs={22}
          rowStyle={() => (deleting ? { stroke: C.db } : {})} />
      </Reveal>

      {/* error cards */}
      <g opacity={e1} transform={`translate(${sh1} 0)`}>
        <rect x={90} y={620} width={1740} height={180} rx={24} fill="#2A1620" stroke={C.accent} strokeWidth={5} />
        <EN x={130} y={684} size={36} anchor="start" fill={C.accent} weight={600}>ERROR: foreign key constraint violation</EN>
        <EN x={130} y={744} size={30} anchor="start" fill="#FCA5A5">{'Key (customer_id)=(999) is not present in table "customers"'}</EN>
      </g>
      <g opacity={e2} transform={`translate(${sh2} 0)`}>
        <rect x={90} y={620} width={1740} height={180} rx={24} fill="#2A1620" stroke={C.accent} strokeWidth={5} />
        <EN x={130} y={684} size={36} anchor="start" fill={C.accent} weight={600}>ERROR: delete violates foreign key constraint</EN>
        <EN x={130} y={744} size={30} anchor="start" fill="#FCA5A5">{'Key (customer_id)=(1) is still referenced from table "orders".'}</EN>
      </g>

      {/* security guard line */}
      <Reveal t={t} at={T.guardAt} until={168.6} dy={14}>
        <rect x={500} y={840} width={920} height={78} rx={39} fill={C.client} opacity={0.14} stroke={C.client} strokeWidth={3} />
        <AR x={1340} y={892} size={34} anchor="start" fill={C.client}>الحارس الأمني الصارم</AR>
        <EN x={760} y={888} size={28} fill={C.client} weight={600}>Strict Security Guard</EN>
      </Reveal>

      {/* captions */}
      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={990} left="INSERT customer_id = 999" right="BLOCKED BY ENGINE" leftColor={C.opt} rightColor={C.accent} size={34} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={990} left="DELETE customer_id = 1" right="PROTECTED BY ENGINE" leftColor={C.opt} rightColor={C.accent} size={34} />
      </g>
    </g>
  );
};
