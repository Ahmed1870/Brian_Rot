import React from 'react';
import { C } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed, MiniTable, CodeBlock } from '../../components/common';
import type { Col, Tok } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s1;
const COLS: Col[] = [
  { k: 'first_name', w: 190, ar: true },
  { k: 'salary', w: 150 },
  { k: 'department_id', w: 190, color: C.client },
  { k: 'avg_dept', w: 140, color: C.opt },
];
const EMP = [['أحمد', '9,500', '10'], ['سارة', '7,000', '10'], ['خالد', '6,200', '20'], ['منى', '8,800', '20'], ['عمر', '5,000', '30']];
const AVG: Record<string, number> = { '10': 8250, '20': 7500, '30': 5000 };
const SAL = [9500, 7000, 6200, 8800, 5000];
const TX = 100, TY = 262, HDR = 54, RH = 62;
const CORR: Tok[][] = [
  [['SELECT ', C.accent], ['first_name, salary', C.text]],
  [['FROM ', C.accent], ['employees e', C.client]],
  [['WHERE ', C.accent], ['salary > (', C.text]],
  [['    SELECT ', C.accent], ['AVG(salary)', C.opt]],
  [['    FROM ', C.accent], ['employees', C.client]],
  [['    WHERE ', C.accent], ['department_id = ', C.text], ['e.department_id', C.purple]],
  [[');', C.text]],
];
const INDEP: Tok[][] = [[['SELECT ', C.accent], ['AVG(salary) ', C.opt], ['FROM ', C.accent], ['employees', C.client]]];
const fmt = (n: number) => n.toLocaleString('en-US');

export const Scene01: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.tablesAt, 0.9);
  const indep = win(t, T.indep[0], T.corrAt, 0.4);
  const corr = p(t, T.corrAt, 0.7);
  const sig = p(t, T.signalAt, 0.6);
  const step = Math.floor((t - T.loopAt) / T.step);
  const cur = t < T.loopAt ? 0 : Math.min(4, step);
  const looping = t >= T.loopAt && t < T.finalAt;
  const fin = p(t, T.finalAt, 0.6);
  const local = ((t - T.loopAt) % T.step) / T.step;
  const dept = EMP[cur][2];
  const avg = AVG[dept];
  const rowY = (r: number) => TY + HDR + r * RH + (RH - 8) / 2;
  const sx = 740, sy = rowY(cur), ex = 1326, ey = 523;
  const prog = looping ? Math.min(1, local * 2.2) : 1;
  const pulse = 0.5 + 0.5 * Math.sin(t * 9);

  return (
    <g>
      <Header t={t} a={T.head[0]} b={T.head[1]} ar="الاستعلامات المترابطة" en="Correlated Subqueries & Row-by-Row Binding" y={105} color={C.purple} />

      {/* outer table */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={70} y={190} w={720} h={480} stroke={C.client} glow={0.4} r={24} />
        <EN x={100} y={238} size={26} anchor="start" fill={C.client} weight={600}>employees e</EN>
        <AR x={760} y={238} size={24} anchor="start" fill={C.muted}>الجدول الخارجي</AR>
        <MiniTable x={TX} y={TY} cols={COLS} rows={EMP.map((r, i) => [...r, (t >= T.loopAt && i <= cur) || t >= T.finalAt ? fmt(AVG[r[2]]) : ''])} rowH={RH} hdrH={HDR} fs={24}
          rowStyle={(i) => {
            const done = (t >= T.loopAt && i < cur) || t >= T.finalAt || (looping && i === cur && local > 0.6);
            const above = done && SAL[i] > AVG[EMP[i][2]];
            const active = looping && i === cur;
            return { stroke: active ? C.purple : above && fin > 0.5 ? C.db : undefined, fill: above && fin > 0.5 ? '#143B31' : active ? '#2B2348' : undefined, opacity: t >= T.finalAt && !above ? 0.45 : 1 };
          }} />
      </g>

      {/* inner query */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <Card x={850} y={190} w={980} h={480} stroke={C.purple} glow={0.4} r={24} />
        <EN x={880} y={238} size={26} anchor="start" fill={C.purple} weight={600}>inner query</EN>
        <AR x={1800} y={238} size={24} anchor="start" fill={C.muted}>الاستعلام الداخلي</AR>
        <g opacity={indep}>
          <CodeBlock lines={INDEP} x={880} y={330} size={30} progress={1} />
          <rect x={880} y={400} width={420} height={64} rx={32} fill={C.db} opacity={0.15} stroke={C.db} strokeWidth={3} />
          <EN x={1090} y={442} size={26} fill={C.db} weight={600}>runs ONCE → 7,300</EN>
          <AR x={1790} y={442} size={30} anchor="start" fill={C.muted}>استعلام مستقل</AR>
        </g>
        <g opacity={corr}>
          <CodeBlock lines={CORR} x={880} y={302} size={29} lineH={46} progress={1} />
          <g opacity={win(t, T.tagAt, 99, 0.5)}>
            <rect x={1420} y={284} width={380} height={50} rx={25} fill={C.purple} opacity={0.2} stroke={C.purple} strokeWidth={3} />
            <EN x={1610} y={318} size={22} fill={C.purple} weight={600}>Correlated Subquery</EN>
          </g>
          {sig > 0 && <rect x={1328} y={ey - 30} width={272} height={42} rx={10} fill={C.purple} opacity={0.18 + 0.2 * pulse} stroke={C.purple} strokeWidth={3} />}
        </g>
      </g>

      {/* purple binding signal: outer row -> inner parameter */}
      {sig > 0 && (
        <g opacity={sig * (1 - fin)}>
          <path d={`M ${sx} ${sy} C ${sx + 220} ${sy - 80} ${ex - 260} ${ey - 120} ${ex} ${ey}`} fill="none" stroke={C.purple} strokeWidth={5} strokeLinecap="round" strokeDasharray="14 12" strokeDashoffset={-t * 90} />
          <circle cx={keys(prog, [0, 1], [sx, ex])} cy={keys(prog, [0, 0.5, 1], [sy, (sy + ey) / 2 - 70, ey])} r={13} fill={C.purple} />
          <circle cx={keys(prog, [0, 1], [sx, ex])} cy={keys(prog, [0, 0.5, 1], [sy, (sy + ey) / 2 - 70, ey])} r={26} fill={C.purple} opacity={0.25} />
        </g>
      )}

      {/* bound value + result */}
      <g opacity={sig}>
        <Card x={850} y={710} w={980} h={160} stroke={C.line} r={24} />
        <EN x={900} y={768} size={28} anchor="start" fill={C.purple} weight={600}>{`e.department_id = ${dept}`}</EN>
        <EN x={900} y={820} size={26} anchor="start" fill={C.muted}>{`→ AVG(salary) = ${fmt(avg)}`}</EN>
        <g opacity={looping ? (local > 0.6 ? 1 : 0.2) : fin}>
          <rect x={1370} y={738} width={420} height={104} rx={20} fill={SAL[cur] > avg ? C.db : C.accent} opacity={0.16} stroke={SAL[cur] > avg ? C.db : C.accent} strokeWidth={3} />
          <EN x={1580} y={788} size={28} fill={SAL[cur] > avg ? C.db : C.accent} weight={600}>{`${fmt(SAL[cur])} > ${fmt(avg)}`}</EN>
          <EN x={1580} y={824} size={24} fill={SAL[cur] > avg ? C.db : C.accent} weight={600}>{SAL[cur] > avg ? 'TRUE ✓' : 'FALSE ✗'}</EN>
        </g>
      </g>
      <g opacity={win(t, T.loopAt, T.finalAt, 0.4)}>
        <EN x={430} y={760} size={26} fill={C.purple} weight={600}>↻ Row-by-Row Execution</EN>
        <EN x={430} y={800} size={22} fill={C.muted}>{`row ${cur + 1} of 5`}</EN>
      </g>
      <g opacity={fin}>
        <rect x={70} y={710} width={720} height={160} rx={24} fill={C.db} opacity={0.12} stroke={C.db} strokeWidth={3} />
        <AR x={740} y={780} size={34} anchor="start" fill={C.db}>الموظفون الأعلى من متوسط قسمهم</AR>
        <EN x={430} y={830} size={24} fill={C.db} weight={600}>أحمد · منى</EN>
      </g>

      <g opacity={win(t, T.cap[0], T.cap[1], 0.4)}>
        <Arrowed y={985} left="Inner Query References Outer Row" right="WHERE department_id = e.department_id" leftColor={C.client} rightColor={C.purple} size={30} />
      </g>
    </g>
  );
};
