import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, S} from '../theme';
import {B} from '../layout';
import {cairo, mono} from '../fonts';
import {Caption, Card, Defs, Scene, Tag, Title, ease, fs, prog} from '../common';

const EMP: {n: string; b: number | null}[] = [
  {n: 'أحمد', b: 200}, {n: 'سارة', b: 200}, {n: 'منى', b: null}, {n: 'كريم', b: null},
];

const Case: React.FC<{box: typeof B.s3.left; fixed: boolean; t0: number}> = ({box, fixed, t0}) => {
  const f = useCurrentFrame();
  const col = fixed ? C.green : C.red;
  const q = fixed ? 'AVG(COALESCE(bonus, 0))' : 'AVG(bonus)';
  const conv = prog(f, t0 + 80, t0 + 140); // NULL -> 0 conversion (fixed only)
  const sumP = prog(f, t0 + (fixed ? 160 : 40), t0 + (fixed ? 220 : 110));
  const denP = prog(f, t0 + (fixed ? 230 : 110), t0 + (fixed ? 280 : 150));
  const resP = ease(prog(f, t0 + (fixed ? 290 : 150), t0 + (fixed ? 340 : 200)));
  const den = fixed ? 4 : 2;
  const res = fixed ? 100 : 200;

  return (
    <Card box={box} accent={col} at={t0 === 0 ? 6 : t0}>
      <div style={{position: 'absolute', left: 30, top: 20, height: 56, display: 'flex', alignItems: 'center', direction: 'ltr', fontFamily: mono, fontWeight: 700, whiteSpace: 'nowrap', fontSize: fs('SELECT AVG(COALESCE(bonus, 0))', box.w - 60, 38, mono), color: C.text}}>
        <span style={{color: C.pink}}>SELECT</span>&nbsp;<span style={{color: col}}>{q}</span>
      </div>

      <svg width={box.w} height={box.h} style={{position: 'absolute', inset: 0}}>
        <Defs />
        <text x={30} y={134} fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>employee</text>
        <text x={420} y={134} textAnchor="end" fontFamily={mono} fontSize={22} fontWeight={700} fill={C.dim}>bonus</text>
        {EMP.map((e, i) => {
          const y = 150 + i * 66;
          const isNull = e.b === null;
          const shownZero = fixed && isNull && conv > 0.5;
          const counted = !isNull || (fixed && conv > 0.5);
          return (
            <g key={i} opacity={prog(f, t0 + 12 + i * 8, t0 + 36 + i * 8)}>
              <rect x={20} y={y} width={410} height={56} rx={14} fill={counted ? (fixed ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.14)') : C.panel2} stroke={isNull && !shownZero ? C.amber : 'transparent'} strokeWidth={2} />
              <text x={38} y={y + 38} fontFamily={cairo} fontSize={30} fontWeight={700} fill={C.text}>{e.n}</text>
              <text x={412} y={y + 38} textAnchor="end" fontFamily={mono} fontSize={30} fontWeight={700} fill={shownZero ? C.green : isNull ? C.amber : C.text}>{shownZero ? '0' : isNull ? 'NULL' : e.b}</text>
            </g>
          );
        })}
        <text x={30} y={450} fontFamily={cairo} fontSize={26} fontWeight={700} fill={C.dim} opacity={prog(f, t0 + 60, t0 + 100)}>
          {fixed ? 'NULL ← صفر، والكل اتحسب' : 'NULL مش بيتحسب'}
        </text>

        {/* fraction: numerator / denominator */}
        <text x={660} y={190} textAnchor="middle" fontFamily={mono} fontSize={80} fontWeight={700} fill={C.text} opacity={sumP}>{Math.round(400 * sumP)}</text>
        <rect x={540} y={214} width={240} height={6} rx={3} fill={C.dim} opacity={prog(f, t0 + 20, t0 + 50)} />
        <text x={660} y={300} textAnchor="middle" fontFamily={mono} fontSize={80} fontWeight={700} fill={col} opacity={denP}>{den}</text>
        <text x={660} y={344} textAnchor="middle" fontFamily={cairo} fontSize={24} fontWeight={700} fill={C.dim} opacity={denP}>{fixed ? 'كل الموظفين' : 'غير الفاضيين بس'}</text>

        {/* result */}
        <g opacity={resP} transform={`translate(0 ${(1 - resP) * 20})`}>
          <rect x={500} y={392} width={320} height={130} rx={22} fill={fixed ? 'rgba(16,185,129,0.20)' : 'rgba(239,68,68,0.20)'} stroke={col} strokeWidth={5} filter="url(#glow)" />
          <text x={660} y={485} textAnchor="middle" fontFamily={mono} fontSize={92} fontWeight={700} fill={col}>{res}</text>
          <text x={660} y={560} textAnchor="middle" fontFamily={cairo} fontSize={30} fontWeight={900} fill={col}>{fixed ? 'المتوسط الصحيح' : 'متوسط مضلّل!'}</text>
        </g>
      </svg>

      <div style={{position: 'absolute', left: 30, right: 30, bottom: 26, textAlign: 'center', direction: 'rtl', fontFamily: cairo, fontWeight: 900, fontSize: fs('400 ÷ 4 = 100 — تقرير مالي آمن', box.w - 80, 34), color: col, opacity: prog(f, t0 + (fixed ? 480 : 220), t0 + (fixed ? 520 : 260))}}>
        {fixed ? (f > 900 ? 'تقرير مالي آمن ✓' : '400 ÷ 4 = 100') : '400 ÷ 2 = 200 ✗'}
      </div>
    </Card>
  );
};

export const Scene03: React.FC = () => (
  <Scene dur={S.s3.dur} accent={C.red}>
    <Title ar="فخ NULL في AVG" en="AVG(bonus) vs AVG(COALESCE(bonus, 0))" chip="SC 03 · NULL TRAP" accent={C.red} />
    <Case box={B.s3.left} fixed={false} t0={0} />
    <Case box={B.s3.right} fixed t0={440} />
    <Caption from={90} to={630} color={C.red}>AVG(bonus) ──► Divides SUM by Non-NULL Count (Skips NULLs)</Caption>
    <Caption from={750} to={1230} color={C.green}>AVG(COALESCE(bonus, 0)) ──► Replaces NULLs with 0 for Accurate Average</Caption>
  </Scene>
);
