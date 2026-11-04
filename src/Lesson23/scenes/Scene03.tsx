import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, CodeBlock, ShieldIcon } from '../../components/common';
import type { Col, Tok } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const CUST = [['1', 'أحمد'], ['2', 'سارة'], ['3', 'خالد'], ['4', 'منى']];
const CCOLS: Col[] = [{ k: 'customer_id', w: 180, color: C.client }, { k: 'name', w: 190, ar: true }];
const NOTIN: Tok[][] = [
  [['SELECT ', C.accent], ['name ', C.text], ['FROM ', C.accent], ['customers c', C.client]],
  [['WHERE ', C.accent], ['c.customer_id ', C.text], ['NOT IN', C.accent]],
  [['  (', C.text], ['SELECT ', C.accent], ['customer_id ', C.text], ['FROM ', C.accent], ['orders', C.client], [');', C.text]],
];
const NOTEX: Tok[][] = [
  [['SELECT ', C.accent], ['name ', C.text], ['FROM ', C.accent], ['customers c', C.client]],
  [['WHERE ', C.accent], ['NOT EXISTS', C.db]],
  [['  (', C.text], ['SELECT 1 ', C.opt], ['FROM ', C.accent], ['orders o', C.client]],
  [['   WHERE ', C.accent], ['o.customer_id = c.customer_id', C.text], [');', C.text]],
];
const OVALS = ['1', '2', 'NULL'];

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.panelsAt, 0.9);
  const safe = p(t, T.safeAt, 0.6);
  const nul = p(t, T.nullAt, 0.5);
  const crash = p(t, T.crashAt, 0.4);
  const shake = t >= T.crashAt && t < T.crashAt + 1.2 ? Math.sin(t * 60) * 7 * (1 - lin(t, T.crashAt, 1.2)) : 0;
  const ex = p(t, T.existsAt, 0.6);
  const sh = p(t, T.shieldAt, 0.7);
  const use = p(t, T.useAt, 0.6);
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);

  return (
    <g>
      <Header t={t} a={T.panelsAt} b={T.safeAt + 4} ar="المعامل العكسي" en="NOT EXISTS vs NOT IN" y={105} color={C.db} />

      {/* shared data */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
        <Card x={90} y={190} w={1740} h={270} stroke={C.line} r={24} />
        <EN x={120} y={234} size={24} anchor="start" fill={C.client} weight={600}>customers</EN>
        <MiniTable x={120} y={250} cols={CCOLS} rows={CUST} rowH={40} hdrH={36} fs={20} />
        <EN x={1140} y={234} size={24} anchor="start" fill={C.opt} weight={600}>orders.customer_id</EN>
        {OVALS.map((v, i) => {
          const isNull = v === 'NULL';
          const a = isNull ? nul : 1;
          return (
            <g key={i} opacity={a} transform={`translate(${1140 + i * 210} 262)`}>
              <rect width={180} height={86} rx={16} fill={isNull ? C.accent : C.cardDeep} fillOpacity={isNull ? 0.25 : 1} stroke={isNull ? C.accent : C.line} strokeWidth={isNull ? 4 : 3} strokeDasharray={isNull ? '10 8' : '0'} />
              <EN x={90} y={56} size={34} fill={isNull ? '#FCA5A5' : C.text} weight={600}>{v}</EN>
            </g>
          );
        })}
        <EN x={1470} y={420} size={22} fill={C.muted}>3 orders rows · one NULL customer_id</EN>
      </g>

      {/* NOT IN (left) */}
      <g opacity={k} transform={`translate(${shake} ${(1 - k) * 20})`}>
        <Card x={90} y={500} w={850} h={400} stroke={crash > 0 ? C.accent : C.line} glow={crash * (0.6 + 0.4 * pulse)} r={24} />
        <EN x={120} y={546} size={26} anchor="start" fill={C.accent} weight={600}>NOT IN</EN>
        <CodeBlock lines={NOTIN} x={120} y={600} size={25} lineH={40} />
        <g opacity={crash}>
          <rect x={120} y={730} width={790} height={130} rx={22} fill={C.accent} opacity={0.16} stroke={C.accent} strokeWidth={4} />
          <EN x={330} y={812} size={56} fill={C.accent} weight={600}>0 rows</EN>
          <EN x={620} y={800} size={20} fill="#FCA5A5">3 NOT IN (1, 2, NULL) → UNKNOWN</EN>
          <path d="M 860 750 L 900 790 M 900 750 L 860 790" stroke={C.accent} strokeWidth={9} strokeLinecap="round" />
        </g>
      </g>

      {/* NOT EXISTS (right) */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
        <Card x={980} y={500} w={850} h={400} stroke={sh > 0 ? C.db : C.line} glow={sh * 0.8} r={24} />
        <EN x={1010} y={546} size={26} anchor="start" fill={C.db} weight={600}>NOT EXISTS</EN>
        <CodeBlock lines={NOTEX} x={1010} y={600} size={25} lineH={40} />
        <g opacity={ex}>
          {[['3', 'خالد'], ['4', 'منى']].map((r, i) => (
            <g key={i} transform={`translate(${1010 + i * 300} 770)`} opacity={p(t, T.existsAt + 0.3 + i * 0.4, 0.5)}>
              <rect width={270} height={84} rx={18} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
              <EN x={50} y={52} size={26} fill={C.db} weight={600}>{r[0]}</EN>
              <AR x={190} y={54} size={32} fill={C.text}>{r[1]}</AR>
            </g>
          ))}
        </g>
        <g opacity={sh} transform={`translate(1730 700) scale(${0.6 + 0.4 * sh})`}>
          <ShieldIcon x={0} y={0} s={0.7} color={C.db} fillOp={0.3} />
          <path d="M -26 0 L -8 20 L 28 -22" fill="none" stroke={C.db} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <g opacity={use}>
          <EN x={1420} y={886} size={22} fill={C.db} weight={600}>inactive customers · unsold products</EN>
        </g>
      </g>

      <g opacity={win(t, T.capA[0], T.capA[1], 0.4)}>
        <Arrowed y={985} left="NOT IN Trap" right="Fails in Presence of NULLs (Three-Valued Logic Crash)" leftColor={C.accent} rightColor={C.text} size={26} />
      </g>
      <g opacity={win(t, T.capB[0], T.capB[1], 0.4)}>
        <Arrowed y={985} left="NOT EXISTS Immunity" right="100% NULL-Safe Boolean Subquery Evaluation" leftColor={C.db} rightColor={C.text} size={28} />
      </g>
    </g>
  );
};
