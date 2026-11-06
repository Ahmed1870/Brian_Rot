import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, CodeBlock } from '../../components/common';
import type { Tok } from '../../components/common';
import { p, lin, win } from '../../anim';
import { EMP, DEPT_COLOR, avg, sum, fmt } from '../../data';
import tl from '../../timeline.json';

const T = tl.s5;
const CODE: Tok[][] = [
  [['SELECT ', C.accent], ['employee_name, department_id, salary,', C.text]],
  [['       AVG(salary) ', C.opt], ['OVER(PARTITION BY department_id)', C.client]],
  [['         AS dept_avg,', C.text]],
  [['       ROUND((salary / ', C.accent], ['SUM(salary)', C.opt]],
  [['         OVER(PARTITION BY department_id)) * 100, 2)', C.client]],
  [['         AS salary_share_pct', C.text]],
  [['FROM ', C.accent], ['employees;', C.client]],
];
const lineLen = (i: number) => CODE[i].map((q) => q[0]).join('').length;
const A_END = 3; // lines 0..2 typed in phase A; 3..6 in phase B
const charsA = CODE.slice(0, A_END).reduce((a, _, i) => a + lineLen(i), 0);
const charsAll = CODE.reduce((a, _, i) => a + lineLen(i), 0);

// report rows: first two departments, grouped
const ROWS = [...EMP.filter((e) => e.d === 10), ...EMP.filter((e) => e.d === 20).slice(0, 2)];
const COLW = [150, 100, 120, 150, 170];
const HEAD = ['employee', 'dept', 'salary', 'dept_avg', 'salary_share_pct'];
const TX = 1070, TY = 280, HDR = 54, RH = 58;
const COLX = COLW.reduce<number[]>((a, w, i) => (a.push(i ? a[i - 1] + COLW[i - 1] : TX), a), []);

export const Scene05: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const dash = p(t, T.dashAt, 0.8);
  const prog = t < T.typeB[0]
    ? (lin(t, T.typeA[0], T.typeA[1] - T.typeA[0]) * charsA) / charsAll
    : (charsA + lin(t, T.typeB[0], T.typeB[1] - T.typeB[0]) * (charsAll - charsA)) / charsAll;
  const av = (i: number) => p(t, T.avgAt + i * 0.35, 0.4);
  const sh = (i: number) => p(t, T.shareAt + i * 0.4, 0.4);
  const live = p(t, T.reportAt, 0.6);
  const sealSp = spring({ frame: Math.round((t - T.sealAt) * fps), fps, config: { stiffness: 160, damping: 11 } });
  const seal = t >= T.sealAt ? sealSp : 0;
  const rowSp = (i: number) => (t >= T.reportAt + i * 0.25 ? spring({ frame: Math.round((t - (T.reportAt + i * 0.25)) * fps), fps, config: { stiffness: 140 } }) : 0);

  return (
    <g>
      <Header t={t} a={T.dashAt - 0.3} b={T.typeA[0] + 3} ar="التطبيقات المؤسسية" en="Enterprise Windowing" y={105} color={C.db} />

      <g opacity={dash} transform={`translate(0 ${(1 - dash) * 20})`}>
        <Card x={70} y={190} w={940} h={520} stroke={C.client} glow={0.4} r={24} />
        <circle cx={110} cy={222} r={7} fill={C.accent} />
        <circle cx={136} cy={222} r={7} fill={C.opt} />
        <circle cx={162} cy={222} r={7} fill={C.db} />
        <CodeBlock lines={CODE} x={104} y={290} size={22} lineH={46} progress={prog} />
      </g>

      {/* HR executive report */}
      <g opacity={dash} transform={`translate(0 ${(1 - dash) * 20})`}>
        <Card x={1040} y={190} w={800} h={520} stroke={live > 0.3 ? C.db : C.line} glow={live * 0.7} r={24} fill="#1B2740" />
        <AR x={1810} y={240} size={30} anchor="start" fill={C.db}>تقرير الموارد البشرية التنفيذي</AR>
        <EN x={1070} y={238} size={20} anchor="start" fill={C.muted}>HR Executive Report</EN>
        {HEAD.map((h, i) => (
          <g key={h} opacity={i >= 3 ? (i === 3 ? av(0) : sh(0)) : 1}>
            <rect x={COLX[i] + 3} y={TY} width={COLW[i] - 6} height={HDR - 8} rx={10} fill={i >= 3 ? C.db : C.client} opacity={0.2} />
            <EN x={COLX[i] + COLW[i] / 2} y={TY + 32} size={i === 4 ? 15 : 18} fill={i >= 3 ? C.db : C.client} weight={600}>{h}</EN>
          </g>
        ))}
        {ROWS.map((e, i) => {
          const y = TY + HDR + i * RH;
          const sp = rowSp(i);
          const share = ((e.s / sum(e.d)) * 100).toFixed(2);
          return (
            <g key={i} transform={`translate(${(1 - Math.min(1, sp || 1)) * 0} ${sp > 0 ? (1 - sp) * 10 : 0})`}>
              <rect x={TX} y={y} width={COLX[4] + COLW[4] - TX} height={RH - 8} rx={12} fill={DEPT_COLOR[e.d]} opacity={0.13} />
              <rect x={TX} y={y} width={7} height={RH - 8} rx={3} fill={DEPT_COLOR[e.d]} />
              <AR x={COLX[0] + COLW[0] / 2} y={y + 35} size={24}>{e.n}</AR>
              <EN x={COLX[1] + COLW[1] / 2} y={y + 34} size={20}>{String(e.d)}</EN>
              <EN x={COLX[2] + COLW[2] / 2} y={y + 34} size={20}>{fmt(e.s)}</EN>
              <g opacity={av(i)}><EN x={COLX[3] + COLW[3] / 2} y={y + 34} size={20} fill={C.db} weight={600}>{fmt(avg(e.d))}</EN></g>
              <g opacity={sh(i)}>
                <rect x={COLX[4] + 10} y={y + 10} width={(COLW[4] - 20) * (parseFloat(share) / 100) * 1.6 * sh(i)} height={6} rx={3} fill={C.opt} opacity={0.8} />
                <EN x={COLX[4] + COLW[4] / 2} y={y + 34} size={20} fill={C.opt} weight={600}>{`${share}%`}</EN>
              </g>
            </g>
          );
        })}
      </g>

      <g opacity={live} transform={`translate(0 ${(1 - live) * 14})`}>
        <rect x={70} y={750} width={940} height={90} rx={45} fill={C.client} opacity={0.12} stroke={C.client} strokeWidth={3} />
        <EN x={540} y={808} size={30} fill={C.client} weight={600}>one SQL query · no JOIN · no Derived Table</EN>
      </g>
      <g opacity={Math.min(1, seal * 1.5)} transform={`translate(1640 790) rotate(-10) scale(${0.5 + 0.5 * seal})`}>
        <circle r={92} fill={C.db} opacity={0.12} />
        <circle r={86} fill="none" stroke={C.db} strokeWidth={6} />
        <path d="M -30 -2 L -9 22 L 32 -30" fill="none" stroke={C.db} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        <EN x={0} y={56} size={15} fill={C.db} weight={600}>EXECUTIVE</EN>
        <EN x={0} y={74} size={15} fill={C.db} weight={600}>HR SEAL</EN>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={985} left="Enterprise Windowing" right="Department Salary Benchmarking & Contribution Pct" leftColor={C.db} rightColor={C.text} size={28} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={985} left="Single-Query Analytics" right="Eliminates Complex Joins & Derived Tables" leftColor={C.db} rightColor={C.text} size={30} />
      </g>
    </g>
  );
};
