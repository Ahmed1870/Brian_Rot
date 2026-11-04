import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, CodeBlock } from '../../components/common';
import type { Col, Tok } from '../../components/common';
import { p, lin, win } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s5;
const CODE: Tok[][] = [
  [['SELECT ', C.accent], ['e.first_name, e.salary, e.department_id', C.text]],
  [['FROM ', C.accent], ['employees e', C.client]],
  [['WHERE ', C.accent], ['e.salary > (', C.text]],
  [['  SELECT ', C.accent], ['AVG(salary) ', C.opt], ['FROM ', C.accent], ['employees', C.client]],
  [['  WHERE ', C.accent], ['department_id = ', C.text], ['e.department_id', C.purple]],
  [[') ', C.text], ['AND NOT EXISTS ', C.db], ['(', C.text]],
  [['  SELECT 1 ', C.opt], ['FROM ', C.accent], ['disciplinary_actions d', C.client]],
  [['  WHERE ', C.accent], ['d.employee_id = e.employee_id', C.text]],
  [[');', C.text]],
];
const lineLen = (i: number) => CODE[i].map((q) => q[0]).join('').length;
const A_END = 5; // lines 0..4 belong to phase A
const charsA = CODE.slice(0, A_END).reduce((a, _, i) => a + lineLen(i), 0);
const charsAll = CODE.reduce((a, _, i) => a + lineLen(i), 0);

const COLS: Col[] = [
  { k: 'first_name', w: 180, ar: true },
  { k: 'salary', w: 130 },
  { k: 'dept_avg', w: 140, color: C.opt },
  { k: '>avg', w: 110, color: C.client },
  { k: 'no_violation', w: 190, color: C.db },
];
const EMP = [
  { n: 'أحمد', s: 9500, a: 8250, v: false },
  { n: 'سارة', s: 7000, a: 8250, v: false },
  { n: 'خالد', s: 6200, a: 7500, v: false },
  { n: 'منى', s: 8800, a: 7500, v: false },
  { n: 'هبة', s: 9100, a: 7050, v: true },
  { n: 'عمر', s: 5000, a: 7050, v: false },
];
const fmt = (n: number) => n.toLocaleString('en-US');

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const ed = p(t, T.editorAt, 0.8);
  const prog = t < T.typeB[0] ? (lin(t, T.typeA[0], T.typeA[1] - T.typeA[0]) * charsA) / charsAll : (charsA + lin(t, T.typeB[0], T.typeB[1] - T.typeB[0]) * (charsAll - charsA)) / charsAll;
  const evalK = (i: number) => p(t, T.evalAt + i * 1.1, 0.4);
  const audK = (i: number) => p(t, T.auditAt + i * 1.1, 0.4);
  const rep = p(t, T.reportAt, 0.7);
  const stampSp = spring({ frame: Math.round((t - T.stampAt) * fps), fps, config: { stiffness: 160, damping: 11 } });
  const stamp = t >= T.stampAt ? stampSp : 0;
  const final = (i: number) => EMP[i].s > EMP[i].a && !EMP[i].v;
  const cardSp = (i: number) => spring({ frame: Math.round((t - (T.reportAt + 0.3 + i * 0.5)) * fps), fps, config: { stiffness: 130 } });

  return (
    <g>
      <Header t={t} a={171.3} b={T.typeA[0] + 3} ar="تقرير مؤسسي بإستعلام واحد" en="Enterprise Subqueries" y={105} color={C.purple} />

      <g opacity={ed} transform={`translate(0 ${(1 - ed) * 20})`}>
        <Card x={90} y={190} w={820} h={500} stroke={C.client} glow={0.4} r={24} />
        <circle cx={130} cy={222} r={7} fill={C.accent} />
        <circle cx={156} cy={222} r={7} fill={C.opt} />
        <circle cx={182} cy={222} r={7} fill={C.db} />
        <CodeBlock lines={CODE} x={124} y={290} size={25} lineH={46} progress={prog} />
      </g>

      <g opacity={ed} transform={`translate(0 ${(1 - ed) * 20})`}>
        <Card x={950} y={190} w={880} h={500} stroke={C.line} glow={0.3} r={24} />
        <EN x={980} y={236} size={24} anchor="start" fill={C.purple} weight={600}>evaluation</EN>
        <MiniTable x={980} y={256} cols={COLS} rows={EMP.map((e, i) => [e.n, fmt(e.s), evalK(i) > 0.3 ? fmt(e.a) : '', evalK(i) > 0.6 ? (e.s > e.a ? '✓' : '✗') : '', audK(i) > 0.5 ? (e.v ? '⚠ action' : '✓ clean') : ''])} rowH={62} hdrH={50} fs={22}
          rowStyle={(i) => {
            const done = audK(i) > 0.5;
            const ok = final(i);
            return { fill: done && ok ? '#143B31' : undefined, stroke: done && ok ? C.db : done && EMP[i].v ? C.accent : undefined, opacity: done && !ok ? 0.5 : 1 };
          }} />
      </g>

      {/* executive report */}
      <g opacity={rep} transform={`translate(0 ${(1 - rep) * 22})`}>
        <Card x={90} y={730} w={1740} h={180} stroke={C.db} glow={0.5} r={24} fill="#1B2740" />
        <AR x={1790} y={786} size={32} anchor="start" fill={C.db}>تقرير الموارد البشرية · الموظفون المتميزون</AR>
        <EN x={130} y={786} size={22} anchor="start" fill={C.muted}>HR Executive Report</EN>
        {[['أحمد', '9,500'], ['منى', '8,800']].map((r, i) => {
          const sp = cardSp(i);
          return (
            <g key={i} opacity={Math.min(1, sp * 1.5)} transform={`translate(${130 + i * 330} ${810 + (1 - sp) * 40})`}>
              <rect width={300} height={78} rx={18} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
              <AR x={80} y={50} size={32}>{r[0]}</AR>
              <EN x={210} y={48} size={26} fill={C.db} weight={600}>{r[1]}</EN>
            </g>
          );
        })}
        <g opacity={p(t, T.reportAt + 1.2, 0.5)}>
          <rect x={820} y={826} width={420} height={56} rx={28} fill={C.client} opacity={0.14} stroke={C.client} strokeWidth={3} />
          <EN x={1030} y={862} size={22} fill={C.client} weight={600}>no JOIN → no duplicate rows</EN>
        </g>
      </g>
      <g opacity={Math.min(1, stamp * 1.5)} transform={`translate(1640 800) rotate(-10) scale(${0.5 + 0.5 * stamp})`}>
        <circle r={86} fill={C.db} opacity={0.12} />
        <circle r={80} fill="none" stroke={C.db} strokeWidth={6} />
        <path d="M -28 -2 L -8 20 L 30 -28" fill="none" stroke={C.db} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <EN x={0} y={52} size={15} fill={C.db} weight={600}>EXECUTIVE</EN>
        <EN x={0} y={70} size={15} fill={C.db} weight={600}>VERIFIED</EN>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={985} left="Enterprise Subqueries" right="Correlated Salary Benchmark + NOT EXISTS Audit" leftColor={C.purple} rightColor={C.text} size={28} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="Sub-Millisecond Execution" right="Zero Row Duplication & Clean Business Logic" leftColor={C.db} rightColor={C.text} size={30} />
      </g>
    </g>
  );
};
