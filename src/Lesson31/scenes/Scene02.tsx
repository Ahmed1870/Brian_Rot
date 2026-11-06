import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, CodeBlock } from '../../components/common';
import type { Tok } from '../../components/common';
import { p, lin, win } from '../../anim';
import { EMP, DEPTS, DEPT_COLOR, GROUPED, avg, fmt } from '../../data';
import tl from '../../timeline.json';

const T = tl.s2;
const CODE: Tok[][] = [
  [['SELECT ', C.accent], ['employee_name, department_id, salary,', C.text]],
  [['       AVG(salary) ', C.opt], ['OVER(', C.client], ['PARTITION BY ', C.accent], ['department_id', C.purple], [')', C.client]],
  [['       AS dept_avg', C.text]],
  [['FROM ', C.accent], ['employees;', C.client]],
];
const TX = 980, TY = 262, HDR = 50, RH = 46, GAP = 16;
const COLW = [190, 110, 140, 160, 130];
const COLX = COLW.reduce<number[]>((a, w, i) => (a.push(i ? a[i - 1] + COLW[i - 1] : TX), a), []);
const HEAD = ['employee_name', 'dept', 'salary', 'dept_avg', 'vs_avg'];

export const Scene02: React.FC<{ t: number }> = ({ t }) => {
  const typed = lin(t, T.typeAt[0], T.typeAt[1] - T.typeAt[0]);
  const ed = p(t, T.typeAt[0] - 0.5, 0.7);
  const split = p(t, T.splitAt, 1.4);
  const col = p(t, T.colAt, 0.6);
  const comp = p(t, T.computeAt, 0.6);
  const diff = p(t, T.diffAt, 0.6);
  const rowY = (i: number) => {
    const g = GROUPED[i];
    const dIdx = DEPTS.indexOf(EMP[i].d);
    const from = TY + HDR + i * RH;
    const to = TY + HDR + g * RH + dIdx * GAP;
    return from + (to - from) * split;
  };
  const blockY = (d: number) => {
    const first = EMP.findIndex((e) => e.d === d);
    const g = GROUPED[first];
    return TY + HDR + g * RH + DEPTS.indexOf(d) * GAP - 6;
  };
  const cnt = (d: number) => EMP.filter((e) => e.d === d).length;

  return (
    <g>
      <Header t={t} a={41.3} b={48.2} ar="الجملة التحديدية OVER" en="OVER ( PARTITION BY ... )" y={105} color={C.client} />

      <g opacity={ed} transform={`translate(0 ${(1 - ed) * 20})`}>
        <Card x={70} y={190} w={860} h={330} stroke={C.client} glow={0.4} r={24} />
        <circle cx={110} cy={222} r={7} fill={C.accent} />
        <circle cx={136} cy={222} r={7} fill={C.opt} />
        <circle cx={162} cy={222} r={7} fill={C.db} />
        <CodeBlock lines={CODE} x={104} y={290} size={24} lineH={52} progress={typed} />
      </g>

      {/* partition legend + averages */}
      <g opacity={split}>
        {DEPTS.map((d, i) => (
          <g key={d} transform={`translate(${90 + i * 285} 560)`}>
            <rect width={265} height={150} rx={20} fill={DEPT_COLOR[d]} opacity={0.14} stroke={DEPT_COLOR[d]} strokeWidth={3} />
            <EN x={132} y={42} size={22} fill={DEPT_COLOR[d]} weight={600}>{`PARTITION dept ${d}`}</EN>
            <EN x={132} y={88} size={34} fill={comp > 0.3 ? C.db : C.muted} weight={600}>{comp > 0.3 ? fmt(avg(d)) : '…'}</EN>
            <EN x={132} y={124} size={18} fill={C.muted}>{`${cnt(d)} rows · independent window`}</EN>
          </g>
        ))}
      </g>

      {/* employees table */}
      <Card x={TX - 30} y={190} w={880} h={HDR + EMP.length * RH + 2 * GAP + 110} stroke={C.line} glow={0.3} r={24} />
      <EN x={TX} y={238} size={24} anchor="start" fill={C.client} weight={600}>employees</EN>
      {HEAD.map((h, i) => (
        <g key={h} opacity={i >= 3 ? (i === 3 ? col : diff) : 1}>
          <rect x={COLX[i] + 3} y={TY} width={COLW[i] - 6} height={HDR - 8} rx={10} fill={i >= 3 ? C.db : C.client} opacity={0.2} />
          <EN x={COLX[i] + COLW[i] / 2} y={TY + 32} size={18} fill={i >= 3 ? C.db : C.client} weight={600}>{h}</EN>
        </g>
      ))}
      {DEPTS.map((d) => (
        <rect key={d} x={TX - 12} y={blockY(d)} width={COLX[4] + COLW[4] - TX + 24} height={cnt(d) * RH + 4} rx={16} fill="none" stroke={DEPT_COLOR[d]} strokeWidth={4} opacity={split} />
      ))}
      {EMP.map((e, i) => {
        const y = rowY(i);
        const dv = e.s - avg(e.d);
        const c = DEPT_COLOR[e.d];
        return (
          <g key={i}>
            <rect x={TX} y={y} width={COLX[4] + COLW[4] - TX} height={RH - 6} rx={10} fill={c} opacity={0.12} />
            <rect x={TX} y={y} width={8} height={RH - 6} rx={4} fill={c} />
            <AR x={COLX[0] + COLW[0] / 2} y={y + 31} size={24}>{e.n}</AR>
            <EN x={COLX[1] + COLW[1] / 2} y={y + 30} size={20}>{String(e.d)}</EN>
            <EN x={COLX[2] + COLW[2] / 2} y={y + 30} size={20}>{fmt(e.s)}</EN>
            <g opacity={col}>
              <rect x={COLX[3] + 8} y={y + 4} width={COLW[3] - 16} height={RH - 14} rx={8} fill={C.db} opacity={0.22} />
              <EN x={COLX[3] + COLW[3] / 2} y={y + 30} size={20} fill={C.db} weight={600}>{fmt(avg(e.d))}</EN>
            </g>
            <g opacity={diff}>
              <EN x={COLX[4] + COLW[4] / 2} y={y + 30} size={20} fill={dv >= 0 ? C.db : '#FCA5A5'} weight={600}>{`${dv >= 0 ? '▲' : '▼'} ${fmt(Math.abs(dv))}`}</EN>
            </g>
          </g>
        );
      })}

      <g opacity={win(t, T.capA[0], T.capA[1], 0.4)}>
        <Arrowed y={985} left="AVG(salary)" right="OVER(PARTITION BY department_id)" leftColor={C.opt} rightColor={C.purple} size={34} />
      </g>
      <g opacity={win(t, T.capB[0], T.capB[1], 0.4)}>
        <Arrowed y={985} left="Sub-Group Isolation" right="Computes Metrics Per Partition Independently" leftColor={C.db} rightColor={C.text} size={28} />
      </g>
    </g>
  );
};
