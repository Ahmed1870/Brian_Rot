import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import { EMP, DEPTS, DEPT_COLOR, GROUPED, avg, fmt } from '../../data';
import tl from '../../timeline.json';

const T = tl.s4;
const NX = 435;
const RX = 900, RY = 290, RH = 44, GAP = 14;

const PNode: React.FC<{ y: number; label: string; sub: string; color: string; k: number; glow?: number }> = ({ y, label, sub, color, k, glow = 0 }) => (
  <g opacity={k} transform={`translate(${NX} ${y + (1 - k) * 20})`}>
    {glow > 0 && <rect x={-270} y={-52} width={540} height={104} rx={24} fill="none" stroke={color} strokeWidth={12} opacity={0.18 * glow} />}
    <rect x={-260} y={-44} width={520} height={88} rx={20} fill={C.cardDeep} stroke={color} strokeWidth={5} />
    <EN x={0} y={-2} size={32} fill={color} weight={600}>{label}</EN>
    <EN x={0} y={30} size={20} fill={C.muted}>{sub}</EN>
  </g>
);

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const wa = p(t, T.scanAt, 0.7);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const aggGlow = p(t, T.aggAt, 0.5);
  const scan = p(t, T.scanAt + 5.5, 0.6);
  const sort = p(t, T.sortAt, 0.6);
  const sorted = p(t, T.sortedAt - 2.6, 2.6);
  const sweep = lin(t, T.sweepAt, 6.6);
  const eff = p(t, T.effAt, 0.6);
  const mil = p(t, T.millionsAt, 0.6);
  const rowY = (i: number) => {
    const from = RY + i * RH;
    const to = RY + GROUPED[i] * RH + DEPTS.indexOf(EMP[i].d) * GAP;
    return from + (to - from) * sorted;
  };
  const blockTop = (d: number) => RY + GROUPED[EMP.findIndex((e) => e.d === d)] * RH + DEPTS.indexOf(d) * GAP;
  const blockH = (d: number) => EMP.filter((e) => e.d === d).length * RH;
  const sweepY = RY - 10 + sweep * (10 * RH + 2 * GAP + 20);

  return (
    <g>
      <Header t={t} a={T.scanAt} b={T.aggAt + 4} ar="عقدة المعالجة المتخصصة" en="WindowAgg Node" y={105} color={C.client} />

      {/* plan tree */}
      <g>
        <Card x={70} y={190} w={760} h={680} stroke={C.line} glow={0.3} r={24} />
        <EN x={100} y={238} size={24} anchor="start" fill={C.client} weight={600}>execution plan</EN>
        <path d={`M ${NX} 376 V 436 M ${NX} 566 V 626`} stroke={C.client} strokeWidth={5} fill="none" opacity={scan} strokeDasharray="10 10" strokeDashoffset={t * 60} />
        <PNode y={330} label="WindowAgg" sub="OVER (PARTITION BY department_id)" color={C.client} k={wa} glow={aggGlow * (0.5 + 0.5 * pulse)} />
        <PNode y={520} label="Sort" sub="Sort Key: department_id · work_mem" color={C.opt} k={sort} />
        <PNode y={710} label="Seq Scan on employees" sub="read once from disk" color={C.muted} k={scan} />
      </g>

      {/* work_mem: rows get sorted by partition, then swept */}
      <g opacity={sort}>
        <Card x={870} y={190} w={960} h={680} stroke={C.opt} glow={0.4} r={24} />
        <EN x={900} y={238} size={24} anchor="start" fill={C.opt} weight={600}>work_mem</EN>
        <AR x={1800} y={238} size={24} anchor="start" fill={C.muted}>فرز حسب PARTITION BY</AR>
        {EMP.map((e, i) => {
          const y = rowY(i);
          return (
            <g key={i}>
              <rect x={RX} y={y} width={560} height={RH - 6} rx={10} fill={DEPT_COLOR[e.d]} opacity={0.25} stroke={DEPT_COLOR[e.d]} strokeWidth={2} />
              <AR x={RX + 530} y={y + 28} size={24} anchor="start">{e.n}</AR>
              <EN x={RX + 40} y={y + 28} size={20} anchor="start" fill={C.muted}>{`dept ${e.d}`}</EN>
              <EN x={RX + 340} y={y + 28} size={20} fill={C.text}>{fmt(e.s)}</EN>
            </g>
          );
        })}
        {/* high-speed sweep window */}
        {sweep > 0 && sweep < 1 && (
          <g>
            <rect x={RX - 14} y={sweepY} width={590} height={64} rx={16} fill={C.client} opacity={0.18} stroke={C.client} strokeWidth={4} />
            <rect x={RX - 14} y={sweepY + 28} width={590} height={8} rx={4} fill={C.client} opacity={0.8} />
          </g>
        )}
        {DEPTS.map((d) => {
          const done = sweep > (blockTop(d) + blockH(d) - RY) / (10 * RH + 2 * GAP + 20);
          return (
            <g key={d} opacity={done ? 1 : 0} transform={`translate(0 ${blockTop(d) + blockH(d) / 2 - 36})`}>
              <rect x={1490} y={0} width={300} height={72} rx={18} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
              <EN x={1640} y={30} size={18} fill={C.muted}>{`dept ${d} avg`}</EN>
              <EN x={1640} y={58} size={28} fill={C.db} weight={600}>{fmt(avg(d))}</EN>
            </g>
          );
        })}
      </g>

      {/* efficiency + scale */}
      <g opacity={eff} transform={`translate(0 ${(1 - eff) * 14})`}>
        <rect x={870} y={890} width={960} height={64} rx={32} fill={C.db} opacity={0.14} stroke={C.db} strokeWidth={3} />
        <EN x={1350} y={932} size={26} fill={C.db} weight={600}>⚡ one fast pass · no re-reading the table from disk</EN>
      </g>
      <g opacity={mil}>
        <rect x={90} y={890} width={740} height={64} rx={32} fill={C.client} opacity={0.14} stroke={C.client} strokeWidth={3} />
        <EN x={460} y={932} size={26} fill={C.client} weight={600}>millions of rows · low memory · fast</EN>
      </g>

      <g opacity={win(t, T.cap1[0], T.cap1[1], 0.4)}>
        <Arrowed y={1020} left="PostgreSQL Query Planner" right="Executes via Specialized WindowAgg Node" leftColor={C.client} rightColor={C.text} size={28} />
      </g>
      <g opacity={win(t, T.cap2[0], T.cap2[1], 0.4)}>
        <Arrowed y={1020} left="In-Memory Partition Sort" right="Sorts Partitions in work_mem for Fast Evaluation" leftColor={C.opt} rightColor={C.text} size={28} />
      </g>
    </g>
  );
};
