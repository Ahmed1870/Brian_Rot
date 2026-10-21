import React from 'react';
import TL from '../timeline.json';
import {CH, prog} from '../theme';
import {ChalkPath, ChalkText} from '../components/Chalk';

const B = TL.s4;

type Quad = {x: number; y: number; name: string; ar: string; color: string; t: number; lines: string[]; extra?: 'cohort'};
const QUADS: Quad[] = [
  {x: 160, y: 140, name: 'SQL', ar: 'متوسط القيمة وعمر العميل', color: CH.yellow, t: B.sql, lines: ['SELECT SUM(revenue) /', '       COUNT(DISTINCT customer_id) AS avg_ltv,', '       AVG(DATEDIFF(day, first_order, last_order))', '       AS lifespan_days', 'FROM orders;']},
  {x: 1000, y: 140, name: 'Python', ar: 'مكتبة lifetimes للتنبؤ', color: CH.pink, t: B.py, lines: ['from lifetimes import BetaGeoFitter', 'bgf = BetaGeoFitter(penalizer_coef=0.01)', "bgf.fit(df['frequency'], df['recency'], df['T'])", "bgf.predict(12, df['frequency'],", "            df['recency'], df['T'])"]},
  {x: 160, y: 540, name: 'Power BI', ar: 'مقياس DAX لقيمة العميل', color: CH.pink, t: B.dax, lines: ['LTV =', '  DIVIDE (', '    SUM ( Sales[Revenue] ),', '    DISTINCTCOUNT ( Sales[CustomerID] )', '  )']},
  {x: 1000, y: 540, name: 'Excel', ar: 'تحليل الأفواج وحساب NPV', color: CH.yellow, t: B.xl, lines: ['=NPV(10%, C2:C6)', '']},
];

/** المشهد 4: 4 مربعات طباشيرية — SQL / Python / Power BI / Excel. */
export const Scene4: React.FC<{t: number}> = ({t}) => {
  const p = (a: number, d: number) => prog(t, a, d);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', left: 0, top: 0}}>
        <ChalkPath d="M 960 120 Q 964 400 958 905" p={p(B.grid, 1.6)} w={6} opacity={0.85} />
        <ChalkPath d="M 130 518 Q 800 512 1790 520" p={p(B.grid + 0.6, 1.6)} w={6} opacity={0.85} />
        {QUADS.map((q, i) => (
          <ChalkPath key={i} d={`M ${q.x} ${q.y + 84} Q ${q.x + 380} ${q.y + 94} ${q.x + 770} ${q.y + 82}`} p={p(q.t + 1.0, 1.0)} color={q.color} w={4.5} />
        ))}
        {/* جدول Cohort صغير (Excel) */}
        {(() => {
          const x0 = 1000;
          const y0 = 760;
          const g = p(B.xl + 4.0, 1.6);
          return (
            <g>
              <ChalkPath d={`M ${x0} ${y0} H ${x0 + 600} V ${y0 + 120} H ${x0} Z M ${x0} ${y0 + 40} H ${x0 + 600} M ${x0} ${y0 + 80} H ${x0 + 600} M ${x0 + 150} ${y0} V ${y0 + 120} M ${x0 + 300} ${y0} V ${y0 + 120} M ${x0 + 450} ${y0} V ${y0 + 120}`} p={g} w={4} opacity={0.8} />
            </g>
          );
        })()}
      </svg>

      {QUADS.map((q, i) => (
        <React.Fragment key={i}>
          <ChalkText text={q.name} x={q.x + 150} y={q.y} w={300} size={68} p={p(q.t, 1.2)} color={q.color} font="en" align="left" />
          <ChalkText text={q.ar} x={q.x + 560} y={q.y + 14} w={440} size={36} p={p(q.t + 0.6, 1.2)} color={CH.white} />
          {q.lines.map((l, k) =>
            l ? (
              <ChalkText key={k} text={l} x={q.x + 385} y={q.y + 104 + k * 50} w={780} size={36} p={p(q.t + (i === 3 ? 2.4 : 3.2) + k * 0.8, 1.2)} color={CH.white} font="en" weight={500} align="left" lh={1.2} />
            ) : null,
          )}
        </React.Fragment>
      ))}
      <ChalkText text="التدفقات النقدية المستقبلية بعد خصمها لقيمتها الحالية" x={1390} y={702} w={780} size={32} p={p(B.xl + 3.2, 1.6)} color={CH.dim as string} />
      {['Y1', 'Y2', 'Y3', 'Y4'].map((h, i) => (
        <ChalkText key={h} text={h} x={1075 + i * 150} y={762} w={140} size={30} p={p(B.xl + 5.4 + i * 0.2, 0.6)} color={CH.pink} font="en" />
      ))}
      {['100%', '82%', '71%', '64%'].map((h, i) => (
        <ChalkText key={h} text={h} x={1075 + i * 150} y={802} w={140} size={30} p={p(B.xl + 6.2 + i * 0.25, 0.6)} color={CH.white} font="en" />
      ))}
      {['C2', 'C3', 'C4', 'C5'].map((h, i) => (
        <ChalkText key={h} text={h} x={1075 + i * 150} y={842} w={140} size={28} p={p(B.xl + 7.0 + i * 0.2, 0.6)} color={CH.dim as string} font="en" />
      ))}
    </div>
  );
};
