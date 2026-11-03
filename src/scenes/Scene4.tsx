import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, START} from '../theme';
import {CUSTOMERS, YEARLY, YEARS, pivotCell} from '../data';
import {Caption, Chip, Editor, Mix, Stage, TopBadge, Win, bez, clamp, lerp, pop, prog, sec} from '../kit';

// SC04 (global 132.5-173.3s): Data Pivoting - vertical rows become horizontal metric columns (Excel Pivot Table in one SQL query).
// Anchors (s): 134.3 golden application | 138.4 "Data Pivoting" | 140.3 rows -> columns | 145.8 sales by year in rows | 149.6 FILTER / CASE WHEN code
// 152.5 a column per year | 154.5 Sales_2023 | 155.8 Sales_2024 | 156.8 next to each customer | 159.2 Excel Pivot Tables | 164.1 matrices | 168.3 one SQL query
const S = START.s4;
const t = (g: number) => sec(g - S);

const CODE = ['SELECT customer,', '  SUM(amount) FILTER (WHERE year = 2023) AS Sales_2023,', '  SUM(amount) FILTER (WHERE year = 2024) AS Sales_2024', 'FROM yearly_sales GROUP BY customer;'];

// long table geometry (Win at 90,190)
const LT_ROW0 = 190 + 56 + 44; // first row top
const LT_H = 50;
const ltY = (i: number) => LT_ROW0 + i * LT_H + LT_H / 2;
// pivot card geometry
const PX = 890;
const PY = 190;
const COLX = [915, 1125, 1365, 1605]; // customer, 2023, 2024, total
const COLW = [210, 240, 240, 200];
const P_HEAD_Y = PY + 14;
const P_ROW0 = P_HEAD_Y + 64;
const P_ROW_H = 60;
const pRowY = (k: number) => P_ROW0 + k * P_ROW_H + P_ROW_H / 2;

type PCell = {ci: number; yi: number; v: number; row: number; at: number};
const CELLS: PCell[] = CUSTOMERS.flatMap((c, ci) =>
  YEARS.map((y, yi) => ({ci, yi, v: pivotCell(c, y), row: YEARLY.findIndex((r) => r.c === c && r.y === y), at: 157.9 + (ci * 2 + yi) * 0.5})),
);
const colTotal = (yi: number) => CUSTOMERS.reduce((a, c) => a + pivotCell(c, YEARS[yi]), 0);
const rowTotal = (ci: number) => YEARS.reduce((a, y) => a + pivotCell(CUSTOMERS[ci], y), 0);

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const tbl = prog(f, t(134.3), 22);
  const word = pop(f, t(138.42));
  const rot = prog(f, t(140.3), sec(1.4));
  const schemaOut = 1 - prog(f, t(149.0), 14);
  const yearHi = prog(f, t(145.8), 16);
  const card = prog(f, t(152.3), 22);
  const h1 = pop(f, t(154.51));
  const h2 = pop(f, t(155.83));
  const flight = clamp((f - t(152.5)) / sec(1.7));
  const custPop = (ci: number) => pop(f, t(156.8 + ci * 0.3));
  const tot = prog(f, t(164.05), 22);
  const totVal = (v: number) => String(Math.round(v * prog(f, t(164.1), sec(1.2))));
  const excel = prog(f, t(159.24), 22);
  const one = pop(f, t(168.3));

  const codeStart = t(149.8);
  const flightChips = YEARS.map((y, yi) => {
    // year chips peel from the long table and rotate 90deg while flying to the pivot header
    const srcRow = YEARLY.findIndex((r) => r.y === y);
    const x0 = 349;
    const y0 = ltY(srcRow);
    const x3 = COLX[1 + yi] + COLW[1 + yi] / 2;
    const y3 = P_HEAD_Y + 32;
    const e = clamp(flight * 1.15 - yi * 0.15);
    if (e <= 0 || e >= 0.995) return null;
    return (
      <div key={y} dir="ltr" style={{position: 'absolute', left: bez(e, x0, x0 + 200, x3 - 260, x3) - 60, top: bez(e, y0, y0 - 60, y3 - 40, y3) - 26, width: 120, height: 52, borderRadius: 14, border: `2px solid ${C.amber}`, background: `${C.amber}22`, boxShadow: `0 0 26px ${C.amber}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.amber, transform: `rotate(${(1 - e) * 90}deg)`}}>
        {y}
      </div>
    );
  });

  return (
    <Stage dur={1225} inFx="left" outFx="up">
      <TopBadge text="Data Pivoting · تدوير البيانات" from={t(134.5)} to={t(148)} color={C.amber} />

      {/* ---------- long (vertical) table */}
      <Win x={90} y={190} w={600} h={420} title="yearly_sales · long format" accent={C.border} opacity={tbl}>
        <div dir="ltr" style={{padding: '0 14px'}}>
          <div style={{display: 'flex', height: 44, alignItems: 'center', fontFamily: MONO, fontSize: 20, color: C.muted, borderBottom: `2px solid ${C.border}`}}>
            <div style={{width: 200, paddingLeft: 10}}>customer</div>
            <div style={{width: 150, paddingLeft: 10, color: yearHi > 0.5 ? C.amber : C.muted, fontWeight: yearHi > 0.5 ? 700 : 400}}>year</div>
            <div style={{width: 150, paddingLeft: 10}}>amount</div>
          </div>
          {YEARLY.map((r, i) => {
            const cell = CELLS.find((c) => c.row === i);
            const src = cell ? clamp(1 - Math.abs(f - (t(cell.at) - sec(0.35))) / sec(0.45)) : 0;
            return (
              <div key={i} style={{display: 'flex', height: LT_H, alignItems: 'center', fontFamily: MONO, fontSize: 25, color: C.text, borderBottom: `1px solid ${C.border}`, background: src > 0 ? `${C.amber}${Math.round(src * 40 + 10).toString(16).padStart(2, '0')}` : yearHi > 0.1 ? `${C.amber}0D` : 'transparent'}}>
                <div style={{width: 200, paddingLeft: 10}}>{r.c}</div>
                <div style={{width: 150, paddingLeft: 10, color: yearHi > 0.5 ? C.amber : C.text, fontWeight: yearHi > 0.5 ? 700 : 400, opacity: flight > 0 && flight < 1 ? 0.35 : 1}}>{r.y}</div>
                <div style={{width: 150, paddingLeft: 10}}>{r.a}</div>
              </div>
            );
          })}
        </div>
      </Win>

      {/* ---------- rows -> columns schematic (before the pivot card exists) */}
      <div style={{opacity: schemaOut * tbl}}>
        <div dir="ltr" style={{position: 'absolute', left: PX, width: 940, top: 215, textAlign: 'center', fontFamily: MONO, fontSize: 52, fontWeight: 700, color: C.amber, opacity: clamp(word), textShadow: `0 0 28px ${C.amber}66`, transform: `scale(${0.85 + 0.15 * clamp(word)})`}}>Data Pivoting</div>
        <div style={{position: 'absolute', left: PX + 470 - 150, top: 330, width: 300, height: 232, transform: `rotate(${-90 * rot}deg)`, display: 'flex', flexDirection: 'column', gap: 20, opacity: clamp(word)}}>
          {[C.blue, C.green, C.amber].map((col, i) => (
            <div key={i} style={{height: 64, borderRadius: 14, background: `${col}22`, border: `3px solid ${col}`, boxShadow: `0 0 24px ${col}44`, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12}}>
              {[0.9, 0.6, 0.75].map((w, j) => (
                <div key={j} style={{height: 12, width: `${w * 30}%`, borderRadius: 6, background: col, opacity: 0.8}} />
              ))}
            </div>
          ))}
        </div>
        <div dir="ltr" style={{position: 'absolute', left: PX, width: 940, top: 622, textAlign: 'center', fontFamily: MONO, fontSize: 26, color: C.muted}}>
          <span style={{opacity: 1 - rot, position: 'absolute', left: 0, right: 0}}>ROWS ↓ vertical</span>
          <span style={{opacity: rot}}>COLUMNS → horizontal</span>
        </div>
      </div>

      {/* ---------- pivot card */}
      <div style={{position: 'absolute', left: PX, top: PY, width: 940, height: 400, borderRadius: 24, background: C.card, border: `2px solid ${C.amber}`, boxShadow: `0 0 44px ${C.amber}22`, opacity: card, transform: `translateY(${(1 - card) * 30}px)`}}>
        <div dir="ltr" style={{position: 'absolute', inset: 0}}>
          {/* header */}
          <div style={{position: 'absolute', left: 25, right: 25, top: 14, height: 64, borderBottom: `2px solid ${C.border}`}} />
          <div style={{position: 'absolute', left: COLX[0] - PX, top: 14, width: COLW[0], height: 64, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: C.muted}}>customer</div>
          {[h1, h2].map((h, yi) => (
            <div key={yi} style={{position: 'absolute', left: COLX[1 + yi] - PX, top: 14, width: COLW[1 + yi], height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.amber, textShadow: `0 0 ${18 * clamp(1 - Math.abs(f - t(yi ? 155.83 : 154.51) - 15) / 30)}px ${C.amber}`, opacity: clamp(h)}}>
              Sales_{YEARS[yi]}
            </div>
          ))}
          <div style={{position: 'absolute', left: COLX[3] - PX, top: 14, width: COLW[3], height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.green, opacity: tot}}>Total</div>
          {/* rows */}
          {CUSTOMERS.map((c, ci) => (
            <div key={c}>
              <div style={{position: 'absolute', left: COLX[0] - PX, top: pRowY(ci) - PY - 30, width: COLW[0], height: 60, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text, opacity: clamp(custPop(ci)), transform: `translateX(${(1 - clamp(custPop(ci))) * -24}px)`}}>{c}</div>
              <div style={{position: 'absolute', left: COLX[3] - PX, top: pRowY(ci) - PY - 30, width: COLW[3], height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green, opacity: tot}}>{totVal(rowTotal(ci))}</div>
            </div>
          ))}
          {CELLS.map((c) => {
            const p = pop(f, t(c.at));
            const glow = clamp(1 - (f - t(c.at)) / sec(0.8));
            return (
              <div key={`${c.ci}-${c.yi}`} style={{position: 'absolute', left: COLX[1 + c.yi] - PX + 20, top: pRowY(c.ci) - PY - 24, width: COLW[1 + c.yi] - 40, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, fontStyle: c.v > 0 ? 'normal' : 'italic', color: c.v > 0 ? C.text : C.muted, background: c.v > 0 ? `${C.amber}${Math.round(glow * 50 + 14).toString(16).padStart(2, '0')}` : 'transparent', border: `2px solid ${c.v > 0 ? C.amber : C.border}`, boxShadow: glow > 0.05 && c.v > 0 ? `0 0 ${24 * glow}px ${C.amber}` : 'none', opacity: clamp(p), transform: `scale(${0.8 + 0.2 * clamp(p)})`}}>
                {c.v > 0 ? c.v : 'NULL'}
              </div>
            );
          })}
          {/* totals row */}
          <div style={{position: 'absolute', left: 25, right: 25, top: pRowY(4) - PY - 30, height: 60, borderTop: `2px solid ${C.border}`, opacity: tot}} />
          <div style={{position: 'absolute', left: COLX[0] - PX, top: pRowY(4) - PY - 30, width: COLW[0], height: 60, display: 'flex', alignItems: 'center', fontFamily: MONO, fontSize: 24, color: C.muted, opacity: tot}}>Total</div>
          {[0, 1].map((yi) => (
            <div key={yi} style={{position: 'absolute', left: COLX[1 + yi] - PX, top: pRowY(4) - PY - 30, width: COLW[1 + yi], height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.green, opacity: tot}}>{totVal(colTotal(yi))}</div>
          ))}
          <div style={{position: 'absolute', left: COLX[3] - PX, top: pRowY(4) - PY - 30, width: COLW[3], height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.text, background: `${C.green}22`, borderRadius: 12, opacity: tot}}>{totVal(colTotal(0) + colTotal(1))}</div>
        </div>
      </div>

      {/* ---------- flying bubbles (source row -> pivot cell) and year chips */}
      <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
        {CELLS.filter((c) => c.row >= 0).map((c) => {
          const e = clamp((f - (t(c.at) - sec(0.7))) / sec(0.7));
          if (e <= 0 || e >= 1) return null;
          const y0 = ltY(c.row);
          const x3 = COLX[1 + c.yi] + COLW[1 + c.yi] / 2 - 10;
          const y3 = pRowY(c.ci);
          const x = bez(e, 690, 800, x3 - 160, x3);
          const y = bez(e, y0, y0, y3, y3);
          return (
            <g key={`${c.ci}-${c.yi}`}>
              <circle cx={x} cy={y} r={20} fill={C.amber} opacity={0.25} />
              <circle cx={x} cy={y} r={9} fill={C.amber} />
            </g>
          );
        })}
      </svg>
      {flightChips}

      {/* ---------- code editor (bottom band) */}
      <Editor x={90} y={665} w={1020} h={245} title="pivot_report.sql" lines={CODE} start={codeStart} cps={1.25} size={22} accent={C.amber} opacity={prog(f, t(149.6), 18)} />

      {/* ---------- Excel mapping card */}
      <div style={{position: 'absolute', left: 1140, top: 665, width: 690, height: 245, borderRadius: 22, background: C.deep, border: `2px solid ${one > 0.5 ? C.amber : C.green}`, opacity: excel, transform: `translateY(${(1 - excel) * 30}px)`}}>
        <div dir="ltr" style={{padding: '18px 26px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <svg width={38} height={38} viewBox="0 0 38 38">
              <rect x={2} y={2} width={34} height={34} rx={6} fill="none" stroke={C.green} strokeWidth={3} />
              <line x1={2} y1={14} x2={36} y2={14} stroke={C.green} strokeWidth={3} />
              <line x1={14} y1={2} x2={14} y2={36} stroke={C.green} strokeWidth={3} />
            </svg>
            <div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: C.green}}>Excel Pivot Table ≙ SQL</div>
          </div>
          {[
            {k: 'Rows', v: 'GROUP BY customer', at: 159.6},
            {k: 'Columns', v: 'FILTER (WHERE year = …)', at: 160.5},
            {k: 'Values', v: 'SUM(amount)', at: 161.4},
          ].map((r) => {
            const p = prog(f, t(r.at), 16);
            return (
              <div key={r.k} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, fontFamily: MONO, fontSize: 24, opacity: p, transform: `translateX(${(1 - p) * 24}px)`}}>
                <span style={{width: 130, color: C.muted}}>{r.k}</span>
                <span style={{color: C.amber}}>→</span>
                <span style={{color: C.text}}>{r.v}</span>
              </div>
            );
          })}
        </div>
        <div style={{position: 'absolute', right: 18, top: 16, opacity: clamp(one), transform: `scale(${0.8 + 0.2 * clamp(one)}) rotate(-4deg)`}}>
          <Chip color={C.amber} style={{fontSize: 24, background: `${C.amber}33`}}>1 SQL query ✓</Chip>
        </div>
      </div>

      <TopBadge text="ما يعادل Pivot Table في Excel" from={t(159.2)} to={t(169)} color={C.green} />
      <Caption text="Data Pivoting ──► Transforms Vertical Rows into Horizontal Metric Columns" from={t(134.6)} to={t(147.8)} />
      <Caption text="Cross-Tabulation ──► Dynamic Yearly & Status Financial Columns" from={t(152.6)} to={t(167)} />
    </Stage>
  );
};
