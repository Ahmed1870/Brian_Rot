import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, CodeBlock } from '../../components/common';
import type { Col, Tok } from '../../components/common';
import { p, lin, win, bump } from '../../anim';
import { EMP, ALL_AVG, DEPTS, DEPT_COLOR, avg, fmt } from '../../data';
import tl from '../../timeline.json';

const T = tl.s1;
const COLS: Col[] = [
  { k: 'employee_name', w: 200, ar: true },
  { k: 'department_id', w: 160 },
  { k: 'salary', w: 140 },
  { k: 'avg_all', w: 170, color: C.db },
];
const TX = 100, TY = 262, HDR = 50, RH = 52;
const CODE: Tok[][] = [
  [['SELECT ', C.accent], ['employee_name, salary,', C.text]],
  [['       AVG(salary) ', C.opt], ['OVER()', C.client], [' AS avg_all', C.text]],
  [['FROM ', C.accent], ['employees;', C.client]],
];

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tableAt, 0.9);
  const win_ = p(t, T.windowAt, 0.9); // frame slides in
  const over = p(t, T.overAt, 0.7);
  const col = (i: number) => p(t, T.overAt + 0.6 + i * 0.28, 0.45);
  const recap = win(t, T.recapAt, T.windowAt - 0.2, 0.5);
  const coll = lin(t, T.collapseAt, 2.4);
  const lost = p(t, T.lostAt, 0.5);
  const retain = p(t, T.retainAt, 0.6);
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  const tableH = HDR + EMP.length * RH;

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="الدوال النافذية والتحليل المتقدم" en="Window Functions & Advanced Analytics" y={105} color={C.client} />

      {/* employees table */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={70} y={190} w={760} h={tableH + 110} stroke={C.line} glow={0.3} r={24} />
        <EN x={100} y={238} size={26} anchor="start" fill={C.client} weight={600}>employees</EN>
        <MiniTable x={TX} y={TY} cols={COLS} rows={EMP.map((e, i) => [e.n, String(e.d), fmt(e.s), col(i) > 0.3 ? fmt(ALL_AVG) : ''])} rowH={RH} hdrH={HDR} fs={22}
          rowStyle={(i) => ({ stroke: col(i) > 0.5 ? C.db : undefined, fill: col(i) > 0.5 ? '#143B31' : undefined })} />
        {/* floating translucent window frame */}
        <g opacity={win_} transform={`translate(0 ${(1 - win_) * -120})`}>
          <rect x={TX - 14} y={TY - 10} width={660} height={tableH + 20} rx={22} fill={C.client} opacity={0.07 + 0.05 * pulse} stroke={C.client} strokeWidth={5} />
          <rect x={TX - 14} y={TY - 10} width={660} height={tableH + 20} rx={22} fill="none" stroke={C.client} strokeWidth={14} opacity={0.12} />
          <rect x={TX + 400} y={TY - 40} width={130} height={32} rx={16} fill={C.client} opacity={0.9} />
          <EN x={TX + 465} y={TY - 17} size={16} fill={C.bg} weight={600}>WINDOW</EN>
        </g>
      </g>

      {/* recap: GROUP BY collapses rows */}
      <g opacity={recap}>
        <Card x={870} y={190} w={960} h={tableH + 110} stroke={C.accent} glow={0.3} r={24} />
        <EN x={900} y={238} size={26} anchor="start" fill={C.accent} weight={600}>GROUP BY</EN>
        <AR x={1800} y={238} size={26} anchor="start" fill={C.muted}>المحرك بيقلّص الصفوف</AR>
        {EMP.map((e, i) => {
          const d = DEPTS.indexOf(e.d);
          const x0 = 920, y0 = 270 + i * 44;
          const tx = 920, ty = 300 + d * 130;
          const c = coll;
          const first = EMP.findIndex((q) => q.d === e.d) === i;
          const x = x0 + (tx - x0) * c, y = y0 + (ty - y0) * c;
          return (
            <g key={i} opacity={first ? 1 : 1 - c}>
              <rect x={x} y={y} width={first ? 520 + 300 * c : 520} height={first ? 36 + 34 * c : 36} rx={10} fill={DEPT_COLOR[e.d]} opacity={0.35} stroke={DEPT_COLOR[e.d]} strokeWidth={2} />
              {!first || c < 0.5 ? <AR x={x + 480} y={y + 26} size={22} anchor="start" fill={C.text}>{e.n}</AR> : null}
              {first && c > 0.6 && <EN x={x + 20} y={y + 47} size={24} anchor="start" fill={C.text} weight={600}>{`dept ${e.d} · AVG = ${fmt(avg(e.d))}`}</EN>}
            </g>
          );
        })}
        <g opacity={lost}>
          <rect x={900} y={680} width={900} height={92} rx={46} fill={C.accent} opacity={0.16} stroke={C.accent} strokeWidth={3} />
          <AR x={1740} y={738} size={34} anchor="start" fill="#FCA5A5">10 صفوف → 3 صفوف · ضاعت التفاصيل</AR>
        </g>
      </g>

      {/* OVER(): result panel */}
      <g opacity={over} transform={`translate(0 ${(1 - over) * 20})`}>
        <Card x={870} y={190} w={960} h={tableH + 110} stroke={C.client} glow={0.5} r={24} />
        <EN x={900} y={238} size={26} anchor="start" fill={C.client} weight={600}>window function</EN>
        <CodeBlock lines={CODE} x={910} y={320} size={30} lineH={52} />
        <rect x={910} y={440} width={880} height={90} rx={22} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={3} />
        <EN x={1350} y={500} size={30} fill={C.db} weight={600}>{`avg_all = ${fmt(ALL_AVG)}  → appended to every row`}</EN>
        <g opacity={retain}>
          <rect x={910} y={570} width={880} height={110} rx={26} fill={C.client} opacity={0.14} stroke={C.client} strokeWidth={3} />
          <EN x={1130} y={640} size={52} fill={C.client} weight={600}>10 → 10</EN>
          <AR x={1760} y={645} size={34} anchor="start" fill={C.client}>الصفوف كلها محتفظة بهويتها</AR>
        </g>
      </g>

      <g opacity={win(t, T.cap[0], T.cap[1], 0.4)}>
        <Arrowed y={985} left="AVG(salary) OVER()" right="Computes Aggregate Window Metric Without Collapsing Rows" leftColor={C.client} rightColor={C.text} size={22} />
      </g>
    </g>
  );
};
