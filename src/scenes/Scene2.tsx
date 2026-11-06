import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO} from '../theme';
import {Caption, Chip, Editor, Stage, TopBadge, Win, clamp, lerp, pop, prog, sec} from '../kit';

// SC02 (frames 1200-2550, global 40-85s): PARTITION BY splits the rows into isolated windows.
const S = 40;
const t = (g: number) => sec(g - S);
const COL = [C.blue, C.purple, C.amber];
const ROWS = [
  {n: 'Laptop', c: 2, a: 1200},
  {n: 'Mouse', c: 1, a: 80},
  {n: 'Chair', c: 3, a: 450},
  {n: 'Keyboard', c: 1, a: 150},
  {n: 'Monitor', c: 2, a: 600},
  {n: 'Desk', c: 3, a: 700},
  {n: 'Cable', c: 1, a: 40},
  {n: 'Webcam', c: 2, a: 220},
  {n: 'Headset', c: 1, a: 180},
  {n: 'Lamp', c: 3, a: 130},
];
const AVGS: Record<number, number> = {1: 112.5, 2: 673.33, 3: 426.67};
const RH = 38;
const GAP = 14;
// final grouped order
const ORDER = [...ROWS].map((r, i) => ({r, i})).sort((x, y) => x.r.c - y.r.c || x.i - y.i);
const FINAL: Record<string, number> = {};
ORDER.forEach((o, k) => (FINAL[o.r.n] = k));

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(44.6), 24);
  const split = prog(f, t(53.2), sec(3.6));
  const frames = prog(f, t(57.8), 20);
  const winP = (c: number) => prog(f, t(62.8 + (c - 1) * 0.3), 14);
  const avgAt = (c: number) => pop(f, t([67.6, 70.3, 72.4][c - 1]));
  const colFill = (i: number) => pop(f, t(75.2) + i * 5);
  const cmp = pop(f, t(80.3));

  const yOf = (n: string, i: number, c: number) => {
    const grp = c - 1;
    const final = FINAL[n] * RH + grp * GAP;
    return lerp(i * RH, final, split);
  };
  const groupTop = (c: number) => ORDER.findIndex((o) => o.r.c === c) * RH + (c - 1) * GAP;
  const groupCount = (c: number) => ROWS.filter((r) => r.c === c).length;

  return (
    <Stage dur={1350} inFx="zoom" outFx="left">
      <TopBadge text="التجزئة الفئوية | OVER(PARTITION BY)" from={t(41.4)} to={t(60)} color={C.purple} />

      <Editor x={90} y={150} w={1250} h={200} title="category_avg.sql" lines={['SELECT product_name, category_id, total_amount,', '       AVG(total_amount) OVER(PARTITION BY category_id) AS category_avg', 'FROM product_sales;']} start={t(41.4)} cps={1.3} size={22} accent={C.purple} />

      <Win x={90} y={380} w={1250} h={520} title="product_sales" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{position: 'relative', padding: '0 22px'}}>
          <div style={{display: 'flex', height: 40, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 290, paddingLeft: 12}}>product_name</div>
            <div style={{width: 200}}>category_id</div>
            <div style={{width: 230}}>total_amount</div>
            <div style={{color: C.green, fontWeight: 700}}>category_avg</div>
          </div>
          <div style={{position: 'relative', height: 440}}>
            {[1, 2, 3].map((c) => (
              <div key={c} style={{position: 'absolute', left: 0, right: 0, top: groupTop(c) - 3, height: groupCount(c) * RH + 6, borderRadius: 12, border: `3px solid ${COL[c - 1]}`, background: `${COL[c - 1]}12`, opacity: frames * (0.5 + 0.5 * winP(c)), boxShadow: winP(c) > 0.5 ? `0 0 14px ${COL[c - 1]}55` : 'none'}} />
            ))}
            {ROWS.map((r, i) => {
              const colored = split > 0.05;
              return (
                <div key={r.n} style={{position: 'absolute', left: 0, right: 0, top: yOf(r.n, i, r.c), height: RH - 2, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 22, color: C.text, opacity: clamp(tbl * 1.4 - i * 0.04)}}>
                  <div style={{width: 290, paddingLeft: 12}}>{r.n}</div>
                  <div style={{width: 200, color: colored ? COL[r.c - 1] : C.text, fontWeight: colored ? 700 : 400}}>{r.c}</div>
                  <div style={{width: 230}}>{r.a}</div>
                  <div style={{color: C.green, fontWeight: 700, opacity: clamp(colFill(FINAL[r.n])), transform: `translateX(${(1 - clamp(colFill(FINAL[r.n]))) * 60}px)`}}>{AVGS[r.c].toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Win>

      {/* per-partition averages */}
      <div dir="ltr" style={{position: 'absolute', left: 1400, top: 380, width: 430, display: 'flex', flexDirection: 'column', gap: 18}}>
        {[1, 2, 3].map((c) => (
          <div key={c} style={{borderRadius: 20, border: `2px solid ${COL[c - 1]}`, background: C.card, padding: '14px 24px', opacity: clamp(avgAt(c)), transform: `scale(${0.9 + 0.1 * clamp(avgAt(c))})`, transformOrigin: 'left center'}}>
            <div style={{fontFamily: MONO, fontSize: 20, color: COL[c - 1], fontWeight: 700}}>partition category_id = {c}</div>
            <div style={{fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.green}}>{AVGS[c].toFixed(2)}</div>
          </div>
        ))}
        <div style={{transform: `scale(${clamp(cmp)})`, opacity: clamp(cmp), transformOrigin: 'left center'}}><Chip color={C.green} style={{fontSize: 22, background: `${C.green}26`}}>direct comparison, same row ✓</Chip></div>
      </div>

      <Caption text="AVG(total_amount) OVER(PARTITION BY category_id)" from={t(47.6)} to={t(62)} />
      <Caption text="Sub-Group Isolation ──► Computes Metrics Per Partition Independently" from={t(67.8)} to={t(83.4)} />
    </Stage>
  );
};
