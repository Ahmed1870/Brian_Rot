import React from 'react';
import {C, fr, T} from '../theme';
import {ChalkDefs, Code, Marker, Stroke, Txt, lineD, rectD} from '../lib/chalk';
import {Header, Sheet} from '../lib/board';
import {ramp} from '../lib/anim';

const S = (t: number) => fr(t);

const PANELS = [
  {id: 'sql', x: 50, y: 120, title: 'SQL', fn: 'NTILE(5)', start: T.sql, end: T.python, lines: [
    'SELECT customer_id,', '  NTILE(5) OVER (ORDER BY last_order DESC) AS r,', '  NTILE(5) OVER (ORDER BY orders) AS f,', '  NTILE(5) OVER (ORDER BY revenue) AS m', 'FROM customers;']},
  {id: 'py', x: 980, y: 120, title: 'Python · pandas', fn: 'pd.qcut()', start: T.python, end: T.powerbi, lines: [
    'import pandas as pd', "df['R'] = pd.qcut(df.recency, 5, labels=[5,4,3,2,1])", "rank_f = df.frequency.rank(method='first')", "df['F'] = pd.qcut(rank_f, 5, labels=[1,2,3,4,5])", "df['M'] = pd.qcut(df.monetary, 5, labels=[1,2,3,4,5])"]},
  {id: 'dax', x: 50, y: 590, title: 'Power BI · DAX', fn: 'PERCENTILE.INC', start: T.powerbi, end: T.excel, lines: [
    'M Score =', 'VAR v = SUM(Sales[Amount])', 'VAR p80 = PERCENTILE.INC(Customers[Spend], 0.8)', 'VAR p60 = PERCENTILE.INC(Customers[Spend], 0.6)', 'RETURN SWITCH(TRUE(), v >= p80, 5, v >= p60, 4, …)', '// wrap in ALLSELECTED() → reacts to slicers']},
  {id: 'xl', x: 980, y: 590, title: 'Excel', fn: 'PERCENTILE.INC', start: T.excel, end: 213.55, lines: [
    '=PERCENTILE.INC($C$2:$C$1001, 0.2)  → P20', '=PERCENTILE.INC($C$2:$C$1001, 0.4)  → P40', '=PERCENTILE.INC($C$2:$C$1001, 0.6)  → P60', '=PERCENTILE.INC($C$2:$C$1001, 0.8)  → P80', '=LOOKUP(C2, $F$2:$F$6, $G$2:$G$6)  → score']},
];

/** Scene 4 (177.1 - 213.9s): four quadrants, each lit and typed exactly while the VO explains its tool. */
export const Scene4_Tools: React.FC<{f: number}> = ({f}) => {
  const a0 = S(T.sql), a1 = S(213.9);
  return (
    <>
      <Header f={f - a0} label="IN PRACTICE" n={4} />
      <Sheet f={f} from={a0} to={a1}>
        <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
          <ChalkDefs />
          {/* chalk cross dividing the screen */}
          <g filter="url(#chalk)">
            <Stroke d={lineD(960, 110, 960, 1040, 2)} f={f} from={a0 + 2} dur={24} w={3.5} />
            <Stroke d={lineD(40, 575, 1880, 575, 3)} f={f} from={a0 + 10} dur={24} w={3.5} />
          </g>
          {PANELS.map((p, i) => {
            const t0 = S(p.start), t1 = S(p.end);
            const active = ramp(f, t0 - 6, t0) * (1 - ramp(f, t1 - 4, t1));
            const op = 0.45 + 0.55 * Math.max(active, f >= t1 ? 0.55 : 0);
            const col = active > 0.5 ? C.yellow : C.chalk;
            return (
              <g key={p.id} opacity={Math.min(1, op + (f > t1 ? 0.15 : 0))}>
                <g filter="url(#chalk)"><Stroke d={rectD(p.x + 10, p.y + 10, 870, 430, 30 + i)} f={f} from={a0 + 14 + i * 6} dur={26} w={active > 0.5 ? 5 : 3} color={col} /></g>
                <Txt x={p.x + 40} y={p.y + 62} text={p.title} f={f} from={a0 + 24 + i * 6} size={46} weight={900} color={col} cps={1.3} />
                <Txt x={p.x + 840} y={p.y + 62} text={p.fn} f={f} from={t0} size={40} weight={900} color={C.yellow} anchor="end" mode="mono" cps={1.2} />
                <Marker x={p.x + 840 - p.fn.length * 24} y={p.y + 70} w={p.fn.length * 24} f={f} from={t0 + 20} h={10} />
                <Code x={p.x + 40} y={p.y + 140} lines={p.lines} f={f} from={t0 + 6} size={22} lh={50} cps={1.9} />
              </g>
            );
          })}
        </svg>
      </Sheet>
    </>
  );
};
