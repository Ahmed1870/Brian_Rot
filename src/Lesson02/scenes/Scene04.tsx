import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Scaled, Card } from '../../components/common';
import { p, lin, win, keys, typed } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s4;
const SW = 330, SH = 180, SY = 290, SX = (i: number) => 120 + i * 450;
const STATIONS = [
  { name: 'Parser', sub: 'Syntax check', color: C.client },
  { name: 'Optimizer', sub: 'Cost evaluation', color: C.opt },
  { name: 'Shared Buffers', sub: 'RAM cache', color: C.db },
  { name: 'Result', sub: 'Client', color: C.accent },
];
const TOKENS: { s: string; c: string }[] = [
  { s: 'SELECT', c: C.accent },
  { s: ' * ', c: C.text },
  { s: 'FROM', c: C.accent },
  { s: ' orders ', c: C.client },
  { s: 'WHERE', c: C.opt },
  { s: ' customer_id = ', c: C.text },
  { s: '105', c: C.db },
  { s: ';', c: C.text },
];
const FULL = TOKENS.map((k) => k.s).join('');
const OPTIONS = [
  { n: 'Seq Scan', cost: 25.4 },
  { n: 'Bitmap Scan', cost: 14.1 },
  { n: 'Index Scan', cost: 8.25 },
];
const RESULT_ROWS = [
  ['7001', '105', '2025-03-02', '640.00'],
  ['7014', '105', '2025-03-11', '215.50'],
  ['7032', '105', '2025-03-27', '89.90'],
];

export const Scene04: React.FC<{ t: number }> = ({ t }) => {
  const nTyped = Math.floor(lin(t, T.typeAt, 3.6) * FULL.length);
  let left = nTyped;
  const cx = (i: number) => SX(i) + SW / 2;
  const pX = keys(t, [T.dropAt, T.parserAt, 127.7, 128.5, 137.4, 138.4, 146.0, 147.0], [cx(0), cx(0), cx(0), cx(1), cx(1), cx(2), cx(2), cx(3)]);
  const LY = SY + 142; // particle / arrow lane
  const pY = keys(t, [T.dropAt, T.parserAt], [235, LY]);
  const pOn = t >= T.dropAt && t < 148;
  const chosen = p(t, T.chosenAt, 0.5);
  const ramK = lin(t, T.ramAt, 1.2);
  const checkK = lin(t, 126, 0.8);

  return (
    <g>
      {/* syntax card */}
      <Reveal t={t} at={T.typeAt - 0.5} dy={20}>
        <Card x={360} y={70} w={1200} h={150} stroke={C.client} glow={0.6} />
        <circle cx={400} cy={104} r={7} fill={C.accent} />
        <circle cx={426} cy={104} r={7} fill={C.opt} />
        <circle cx={452} cy={104} r={7} fill={C.db} />
        <text x={420} y={180} fontFamily={FONT_MONO} fontSize={44} fontWeight={600} direction="ltr">
          {TOKENS.map((k, i) => {
            const take = Math.max(0, Math.min(k.s.length, left));
            left -= take;
            return (
              <tspan key={i} fill={k.c} xmlSpace="preserve">{k.s.slice(0, take)}</tspan>
            );
          })}
        </text>
      </Reveal>

      {/* stations */}
      {STATIONS.map((s, i) => {
        const k = p(t, T.typeAt + 1 + i * 0.3, 0.6);
        const hot = (i === 0 && t >= T.parserAt && t < T.optAt) || (i === 1 && t >= T.optAt && t < T.ramAt - 1) || (i === 2 && t >= T.ramAt && t < T.resultAt) || (i === 3 && t >= T.resultAt);
        return (
          <g key={i} opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
            <Scaled cx={cx(i)} cy={SY + SH / 2} s={hot ? 1.04 : 1}>
              <Card x={SX(i)} y={SY} w={SW} h={SH} stroke={hot ? s.color : C.line} glow={hot ? 1 : 0} />
              <EN x={cx(i)} y={SY + 62} size={32} weight={600} fill={s.color}>{s.name}</EN>
              <EN x={cx(i)} y={SY + 102} size={22} fill={C.muted}>{s.sub}</EN>
            </Scaled>
            {i < 3 && <path d={`M ${SX(i) + SW + 16} ${LY} H ${SX(i + 1) - 16}`} stroke={C.line} strokeWidth={4} strokeLinecap="round" strokeDasharray="10 12" strokeDashoffset={-t * 50} />}
          </g>
        );
      })}

      {/* parser check (top-right corner of the Parser card) */}
      <path d={`M ${SX(0) + SW - 70} ${SY + 38} L ${SX(0) + SW - 54} ${SY + 54} L ${SX(0) + SW - 26} ${SY + 22}`} fill="none" stroke={C.db} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - checkK} />

      {/* RAM hit meter */}
      {t >= T.ramAt && (
        <g>
          <rect x={SX(2) + 30} y={SY + SH + 14} width={SW - 60} height={14} rx={7} fill={C.cardDeep} />
          <rect x={SX(2) + 30} y={SY + SH + 14} width={(SW - 60) * ramK} height={14} rx={7} fill={C.db} />
          <EN x={cx(2)} y={SY + SH + 62} size={26} fill={C.db} weight={600}>RAM Hit 100%</EN>
        </g>
      )}

      {/* optimizer options + cost tag */}
      <Reveal t={t} at={T.optAt + 0.3} dy={24}>
        <Card x={480} y={560} w={510} h={310} stroke={C.opt} glow={0.4} r={24} />
        {OPTIONS.map((o, i) => {
          const k = p(t, T.optRows + i * 0.9, 0.5);
          const y = 660 + i * 66;
          const win_ = i === 2;
          return (
            <g key={i} opacity={k} transform={`translate(${(1 - k) * -24} 0)`}>
              <rect x={510} y={y} width={450} height={52} rx={12} fill={win_ && chosen > 0 ? C.db : C.cardDeep} opacity={win_ && chosen > 0 ? 0.28 : 1} stroke={win_ && chosen > 0 ? C.db : 'none'} strokeWidth={3} />
              <EN x={532} y={y + 35} size={22} anchor="start">{o.n}</EN>
              <EN x={940} y={y + 35} size={22} anchor="end" fill={win_ && chosen > 0 ? C.db : C.opt} weight={600}>{`Cost: ${o.cost.toFixed(2)}`}</EN>
            </g>
          );
        })}
      </Reveal>
      <Reveal t={t} at={T.costTag[0]} until={T.costTag[1]} dy={16}>
        <rect x={515} y={584} width={440} height={50} rx={25} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={2} />
        <EN x={735} y={618} size={22} fill={C.db} weight={600}>Optimal Path Chosen | Cost: 8.25</EN>
      </Reveal>

      {/* result grid */}
      <Reveal t={t} at={T.resultAt} dy={30}>
        <Card x={1060} y={560} w={740} h={310} stroke={C.accent} glow={0.5} r={24} />
        <EN x={1100} y={612} size={24} anchor="start" fill={C.accent} weight={600}>orders · customer_id = 105</EN>
        {RESULT_ROWS.map((r, i) => {
          const k = p(t, T.resultAt + 0.5 + i * 0.4, 0.5);
          const y = 640 + i * 62;
          return (
            <g key={i} opacity={k}>
              <rect x={1090} y={y} width={680} height={50} rx={10} fill={i % 2 ? C.cardDeep : '#243247'} />
              {r.map((v, j) => (
                <EN key={j} x={1114 + j * 170} y={y + 34} size={22} anchor="start" fill={j === 1 ? C.db : C.text}>{v}</EN>
              ))}
            </g>
          );
        })}
      </Reveal>

      {/* particle */}
      {pOn && (
        <g opacity={win(t, T.dropAt, 148, 0.3)}>
          <circle cx={pX} cy={pY} r={28} fill={C.opt} opacity={0.2} />
          <circle cx={pX} cy={pY} r={13} fill={C.opt} />
        </g>
      )}

      {/* performance badge */}
      <Reveal t={t} at={T.badge[0]} until={T.badge[1]} dy={20}>
        <rect x={380} y={930} width={1160} height={84} rx={42} fill={C.db} opacity={0.18} stroke={C.db} strokeWidth={3} />
        <EN x={960} y={986} size={42} fill={C.db} weight={600}>Execution Time: 0.001 sec (RAM Hit)</EN>
      </Reveal>
    </g>
  );
};
