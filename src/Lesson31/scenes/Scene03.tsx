import React from 'react';
import { C, FONT_MONO } from '../../theme';
import { AR, EN, Reveal, Card, Header, Arrowed } from '../../components/common';
import { p, lin, win, keys } from '../../anim';
import tl from '../../timeline.json';

const T = tl.s3;
const COLORS = [C.purple, C.client, C.opt, '#F472B6'];
const DEPT_NAMES = ['dept 10', 'dept 20', 'dept 30', 'dept 40'];
const CW = 56, CH = 24, GX = 8, GY = 10;
const cellPos = (gx: number, i: number) => ({ x: gx + (i % 10) * (CW + GX), y: 330 + Math.floor(i / 10) * (CH + GY) });
const dept = (i: number) => Math.floor(i / 25); // 0..3, 25 rows each
const idxIn = (i: number) => i % 25;

export const Scene03: React.FC<{ t: number }> = ({ t }) => {
  const k = p(t, T.panelsAt, 0.9);
  const coll = lin(t, T.collapseAt, 2.6);
  const names = p(t, T.namesAt, 0.5);
  const win_ = p(t, T.winAt, 0.6);
  const att = (i: number) => p(t, T.attachAt + (i % 10) * 0.06 + Math.floor(i / 10) * 0.12, 0.5);
  const nj = p(t, T.noJoinAt, 0.5);
  const nj2 = p(t, T.noJoinAt + 1.4, 0.5);
  const LG = 110, RG = 1030;
  const barX = LG, barW = 640;

  return (
    <g>
      <Header t={t} a={T.panelsAt} b={T.gbAt - 0.3} ar="مقارنة بنيوية" en="GROUP BY vs Window Functions" y={105} color={C.client} />

      {/* LEFT: GROUP BY */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
        <Card x={70} y={190} w={880} h={700} stroke={coll > 0.3 ? C.accent : C.line} glow={coll * 0.6} r={24} />
        <EN x={100} y={238} size={28} anchor="start" fill={C.accent} weight={600}>GROUP BY</EN>
        <text x={100} y={290} fontFamily={FONT_MONO} fontSize={22} fontWeight={600} direction="ltr" fill={C.muted}>SELECT department_id, AVG(salary) … GROUP BY department_id;</text>
        <EN x={850} y={238} size={22} anchor="end" fill={C.muted}>100 rows</EN>
        {Array.from({ length: 100 }).map((_, i) => {
          const d = dept(i), j = idxIn(i);
          const from = cellPos(LG, i);
          const barY = 700 + d * 42;
          const c = coll;
          const isBar = j === 0;
          const x = from.x + (barX - from.x) * c;
          const y = from.y + (barY - from.y) * c;
          const w = isBar ? CW + (barW - CW) * c : CW * (1 - 0.4 * c);
          const o = isBar ? 1 : 1 - Math.min(1, c * 1.3);
          return <rect key={i} x={x} y={y} width={w} height={isBar ? CH + 8 * c : CH} rx={6} fill={COLORS[d]} opacity={0.55 * o + (isBar ? 0.3 * c : 0)} stroke={COLORS[d]} strokeWidth={isBar && c > 0.9 ? 3 : 0} />;
        })}
        {coll > 0.9 && [0, 1, 2, 3].map((d) => (
          <EN key={d} x={barX + 20} y={700 + d * 42 + 26} size={20} anchor="start" fill={C.text} weight={600}>{`${DEPT_NAMES[d]} · AVG`}</EN>
        ))}
        <g opacity={names}>
          <rect x={130} y={430} width={720} height={150} rx={30} fill={C.accent} opacity={0.14} stroke={C.accent} strokeWidth={3} />
          <EN x={490} y={500} size={44} fill={C.accent} weight={600}>100 → 4 rows</EN>
          <AR x={800} y={552} size={32} anchor="start" fill="#FCA5A5">أسماء الموظفين اختفت</AR>
        </g>
      </g>

      {/* RIGHT: Window Functions */}
      <g opacity={k} transform={`translate(0 ${(1 - k) * 20})`}>
        <Card x={970} y={190} w={880} h={700} stroke={win_ > 0 ? C.db : C.line} glow={win_ * 0.7} r={24} />
        <EN x={1000} y={238} size={28} anchor="start" fill={C.db} weight={600}>Window Functions</EN>
        <text x={1000} y={290} fontFamily={FONT_MONO} fontSize={22} fontWeight={600} direction="ltr" fill={C.muted}>SELECT name, salary, AVG(salary) OVER(PARTITION BY dept) …</text>
        <EN x={1820} y={238} size={22} anchor="end" fill={C.muted}>100 rows</EN>
        {Array.from({ length: 100 }).map((_, i) => {
          const d = dept(i);
          const pos = cellPos(RG, i);
          const a = att(i);
          return (
            <g key={i}>
              <rect x={pos.x} y={pos.y} width={CW - 16 * a} height={CH} rx={6} fill={COLORS[d]} opacity={0.55} />
              <rect x={pos.x + CW - 16 * a + 2} y={pos.y} width={Math.max(0, 16 * a - 2)} height={CH} rx={5} fill={C.db} opacity={0.95 * a} />
            </g>
          );
        })}
        <g opacity={win_}>
          <rect x={RG - 12} y={318} width={10 * (CW + GX) + 8} height={10 * (CH + GY) + 16} rx={14} fill="none" stroke={C.client} strokeWidth={4} opacity={0.55} />
        </g>
        <g opacity={p(t, T.attachAt + 1.5, 0.5)}>
          <rect x={1000} y={720} width={810} height={86} rx={43} fill={C.db} opacity={0.15} stroke={C.db} strokeWidth={3} />
          <EN x={1230} y={774} size={34} fill={C.db} weight={600}>100 rows retained</EN>
          <AR x={1790} y={774} size={30} anchor="start" fill={C.db}>+ عمود المؤشر المجمع</AR>
        </g>
        <g opacity={nj}>
          <rect x={1000} y={822} width={250} height={48} rx={24} fill={C.accent} opacity={0.14} stroke={C.accent} strokeWidth={3} />
          <EN x={1125} y={854} size={22} fill="#FCA5A5" weight={600}>JOIN ✗</EN>
        </g>
        <g opacity={nj2}>
          <rect x={1280} y={822} width={330} height={48} rx={24} fill={C.accent} opacity={0.14} stroke={C.accent} strokeWidth={3} />
          <EN x={1445} y={854} size={22} fill="#FCA5A5" weight={600}>Derived Table ✗</EN>
        </g>
      </g>

      <g opacity={win(t, T.capA[0], T.capA[1], 0.4)}>
        <Arrowed y={985} left="GROUP BY" right="Collapses 100 Rows to 4 Summary Rows (Loses Detail)" leftColor={C.accent} rightColor={C.text} size={28} />
      </g>
      <g opacity={win(t, T.capB[0], T.capB[1], 0.4)}>
        <Arrowed y={985} left="Window Functions" right="Retains All 100 Rows + Appends Group Metric" leftColor={C.db} rightColor={C.text} size={28} />
      </g>
    </g>
  );
};
