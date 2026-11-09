import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START} from '../theme';
import {PRODUCTS_SORTED_BY_QTY, SALES_RAW, SORTED_BY_AMOUNT_DESC, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC02: SORT (internal) + SORTBY (external) — typed formulas on same grid.
// Phase 1 (40-60s): type =SORT(tbl_Sales, 4, -1) → table reorders by Amount DESC (green).
// Phase 2 (60-85s): type =SORTBY(Products, Quantity, -1) → names sort by external qty (purple).
const S = START.s2;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 130, 110, 120, 100, 30, 160, 100][c] ?? XL.colW;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 480, fy: 280, z: 0.95}, prog(f, t(2), 30));

  // Phase 1: SORT
  const sortTyped = typed('=SORT(A1:D11, 4, -1)', f, t(42), 1.2);
  const sortDone = f >= t(50);
  const sortP = sortDone ? prog(f, t(50.5), 16) : 0;
  const sortFilled = Math.floor(sortP * SALES_RAW.length);

  // Phase 2: SORTBY
  const phase2 = f >= t(60);
  const sortbyTyped = phase2 ? typed('=SORTBY(G2:G6, H2:H6, -1)', f, t(60.5), 1.2) : '';
  const sortbyDone = f >= t(68);
  const sortbyP = sortbyDone ? prog(f, t(68.5), 14) : 0;
  const sortbyFilled = Math.floor(sortbyP * PRODUCTS_SORTED_BY_QTY.length);

  const fbEdit = (f >= t(42) && f < t(50.5)) || (phase2 && f >= t(60.5) && f < t(68.5));
  const formula = phase2 ? sortbyTyped : sortTyped;

  // Cursor
  const fbY = geo(1, 0, 1).fbTop + 14;
  const a13 = cellCenter(13, 1, {colW}); // SORT result
  const g13 = cellCenter(13, 7, {colW}); // SORTBY result
  const pts = dwell([
    {f: t(42), x: 200, y: fbY},
    {f: t(50), x: a13.x, y: a13.y},
    {f: t(60.5), x: 200, y: fbY},
    {f: t(68), x: g13.x, y: g13.y},
    {f: t(70), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [42, 50, 60.5, 68];
  const curHide = f > t(71);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const g0 = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s2.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sorting.xlsx" nameBox={phase2 ? 'G13' : 'A13'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Original table A1:D11 (source)
            if (c <= 4 && r <= 11) return salesCell(r, c) as any;

            // Source for SORTBY: G2:H6 (Product names + quantities)
            if (c === 7 && r >= 2 && r <= 6) {
              if (r === 2) return {t: PRODUCTS_SORTED_BY_QTY[r - 2].name};
              // Wait, source should have headers
              return {t: PRODUCTS_SORTED_BY_QTY[r - 2].name};
            }
            if (c === 8 && r >= 2 && r <= 6) {
              return {t: String(PRODUCTS_SORTED_BY_QTY[r - 2].qty), al: 'r'};
            }
            // Headers for G:H
            if (r === 1 && c === 7) return {t: 'Product', b: true, bg: '#E2EFDA', al: 'l'};
            if (r === 1 && c === 8) return {t: 'Qty', b: true, bg: '#E2EFDA', al: 'r'};

            // SORT result: A13 onwards (reordered table)
            if (!phase2 && c <= 4 && r >= 13) {
              if (r === 13) return salesCell(1, c) as any;
              const idx = r - 14;
              if (idx < sortFilled && idx < SORTED_BY_AMOUNT_DESC.length) {
                const row = SORTED_BY_AMOUNT_DESC[idx];
                return c === 1 ? {t: row.category, color: '#107C41'} : c === 2 ? {t: row.branch, color: '#107C41'} : c === 3 ? {t: row.customer, color: '#107C41'} : {t: row.amount.toLocaleString('en-US'), al: 'r', color: '#107C41'};
              }
              return undefined;
            }

            // SORTBY result: G13 onwards (sorted product names)
            if (phase2 && c === 7 && r >= 13) {
              if (r === 13) return {t: 'Product (Sorted)', b: true, bg: '#D1FAE5', al: 'l', color: '#107C41'};
              const idx = r - 14;
              if (idx < sortbyFilled && idx < PRODUCTS_SORTED_BY_QTY.length) {
                return {t: PRODUCTS_SORTED_BY_QTY[idx].name, color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 13, c1: 7, r2: 13, c2: 7} : {r1: 13, c1: 1, r2: 13, c2: 1}}
          active={phase2 ? {r: 13, c: 7} : {r: 13, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* SORT result border */}
          {!phase2 && sortP > 0.05 ? (
            <Neon x={cellCenter(14, 1, {colW}).x - colW(1) / 2} y={cellCenter(14, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * SALES_RAW.length} color={C.green} p={sortP * (1 - prog(f, t(85), 12))} label="=SORT (Amount DESC)" labelBelow />
          ) : null}
          {/* SORTBY result border */}
          {phase2 && sortbyP > 0.05 ? (
            <Neon x={cellCenter(14, 7, {colW}).x - colW(7) / 2} y={cellCenter(14, 7, {colW}).y - XL.rowH / 2} w={colW(7)} h={XL.rowH * PRODUCTS_SORTED_BY_QTY.length} color={C.purple} p={sortbyP * (1 - prog(f, t(85), 12))} label="=SORTBY (by external Qty)" labelBelow />
          ) : null}
          {/* Source highlight */}
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={g0.rowsTop} w={colW(1) + colW(2) + colW(3) + colW(4)} h={XL.rowH * 11} color={C.amber} p={0.15} label="Source table" labelBelow />
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={phase2 && c >= 60 ? C.purple : C.green} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Bottom formula badge */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', opacity: clamp(prog(f, t(42), 12) * (1 - prog(f, t(85), 12)))}}>
        <div style={{display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(11,18,34,0.95)', border: `2px solid ${C.border}`, borderRadius: 12, padding: '8px 18px'}}>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.muted : C.green, opacity: phase2 ? 0.5 : 1}}>=SORT(table, 4, -1) → internal sort</span>
          <span style={{fontFamily: MONO, fontSize: 16, color: C.muted}}>│</span>
          <span style={{fontFamily: MONO, fontSize: 18, fontWeight: 700, color: phase2 ? C.purple : C.muted, opacity: phase2 ? 1 : 0.5}}>=SORTBY(names, qty, -1) → external sort</span>
        </div>
      </div>

      <TopBadge text="Internal Sorting ──► =SORT(array, sort_index, sort_order) (Descending -1)" from={t(42.0)} to={t(60.0)} />
      {phase2 ? <Caption text="External Array Sorting ──► =SORTBY(array, by_array1, sort_order1)" from={t(60.0)} to={t(84.0)} tone="ok" /> : null}
    </Stage>
  );
};
