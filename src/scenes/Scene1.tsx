import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {ALEX_SALES, CAIRO_SALES, HSTACK_RESULT, PRODUCTS_TABLE, SALES_TABLE, VSTACK_RESULT} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC01: VSTACK + HSTACK — typed formulas on the same grid.
// Phase 1 (0-18s): type =VSTACK(tbl_Cairo, tbl_Alex) → tables stack vertically (blue).
// Phase 2 (18-40s): type =HSTACK(tbl_Products, tbl_Sales) → tables stack horizontally (green).
// Single Excel window. Source tables shown in left area, results on right.
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 130, 80, 100, 120, 130, 80, 100][c] ?? XL.colW;

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 500, fy: 260, z: 1.0}, prog(f, t(2), 30));

  // Phase 1: VSTACK
  const vstackTyped = typed('=VSTACK(A2:C5, A7:C10)', f, t(3.0), 1.2);
  const vstackDone = f >= t(8.0);
  const vstackP = vstackDone ? prog(f, t(8.5), 16) : 0;
  const vstackFilled = Math.floor(vstackP * VSTACK_RESULT.length);

  // Phase 2: HSTACK (after 18s)
  const phase2 = f >= t(18.0);
  const hstackTyped = phase2 ? typed('=HSTACK(F2:G5, H2:I5)', f, t(18.5), 1.2) : '';
  const hstackDone = f >= t(23.5);
  const hstackP = hstackDone ? prog(f, t(24), 14) : 0;

  const fbEdit = (f >= t(3.0) && f < t(8.5)) || (phase2 && f >= t(18.5) && f < t(24));
  const formula = phase2 ? hstackTyped : vstackTyped;

  // Cursor
  const fbY = geo(1, 0, 1).fbTop + 14;
  const a11 = cellCenter(11, 1, {colW}); // VSTACK result cell
  const f11 = cellCenter(11, 6, {colW}); // HSTACK result cell
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(8.0), x: a11.x, y: a11.y},
    {f: t(18.5), x: 200, y: fbY},
    {f: t(23.5), x: f11.x, y: f11.y},
    {f: t(25), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [3.0, 8.0, 18.5, 23.5];
  const curHide = f > t(26);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Merge.xlsx" nameBox={phase2 ? 'F11' : 'A11'} formula={formula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Source: Cairo table A2:C5 (rows 2-5, cols 1-3)
            if (r >= 2 && r <= 5 && c >= 1 && c <= 3) {
              if (r === 2) return {t: ['Product', 'Qty', 'Amount'][c - 1], b: true, bg: '#DBEAFE', al: c >= 2 ? 'r' : 'l', color: '#1E40AF'};
              const row = CAIRO_SALES[r - 3];
              if (!row) return undefined;
              return c === 1 ? {t: row.product} : c === 2 ? {t: String(row.qty), al: 'r'} : {t: String(row.amount), al: 'r'};
            }
            // Source: Alex table A7:C10 (rows 7-10, cols 1-3)
            if (r >= 7 && r <= 10 && c >= 1 && c <= 3) {
              if (r === 7) return {t: ['Product', 'Qty', 'Amount'][c - 1], b: true, bg: '#FEF3C7', al: c >= 2 ? 'r' : 'l', color: '#92400E'};
              const row = ALEX_SALES[r - 8];
              if (!row) return undefined;
              return c === 1 ? {t: row.product} : c === 2 ? {t: String(row.qty), al: 'r'} : {t: String(row.amount), al: 'r'};
            }
            // VSTACK result: A11 onwards (rows 11-18, cols 1-3)
            if (r >= 11 && r <= 18 && c >= 1 && c <= 3) {
              const idx = r - 11;
              if (idx === 0) return {t: ['Product', 'Qty', 'Amount'][c - 1], b: true, bg: '#D1FAE5', al: c >= 2 ? 'r' : 'l', color: '#107C41'};
              const resultIdx = idx - 1;
              if (resultIdx < vstackFilled && resultIdx < VSTACK_RESULT.length) {
                const row = VSTACK_RESULT[resultIdx];
                return c === 1 ? {t: row.product, color: '#107C41'} : c === 2 ? {t: String(row.qty), al: 'r', color: '#107C41'} : {t: String(row.amount), al: 'r', color: '#107C41'};
              }
              return undefined;
            }
            // Source: Products table F2:G5 (rows 2-5, cols 6-7)
            if (r >= 2 && r <= 5 && c >= 6 && c <= 7) {
              if (r === 2) return {t: ['SKU', 'Name'][c - 6], b: true, bg: '#DBEAFE', al: 'l', color: '#1E40AF'};
              const row = PRODUCTS_TABLE[r - 3];
              if (!row) return undefined;
              return c === 6 ? {t: row.sku} : {t: row.name};
            }
            // Source: Sales table H2:I5 (rows 2-5, cols 8-9) — only visible in phase2
            if (phase2 && r >= 2 && r <= 5 && c >= 8 && c <= 9) {
              if (r === 2) return {t: ['SKU2', 'Price'][c - 8], b: true, bg: '#FEF3C7', al: c === 9 ? 'r' : 'l', color: '#92400E'};
              const row = SALES_TABLE[r - 3];
              if (!row) return undefined;
              return c === 8 ? {t: row.sku} : {t: String(row.price), al: 'r'};
            }
            // HSTACK result: F11 onwards (rows 11-14, cols 6-9)
            if (phase2 && r >= 11 && r <= 14 && c >= 6 && c <= 9) {
              const idx = r - 11;
              if (idx === 0) return {t: ['SKU', 'Name', 'SKU2', 'Price'][c - 6], b: true, bg: '#D1FAE5', al: c === 9 ? 'r' : 'l', color: '#107C41'};
              const resultIdx = idx - 1;
              if (resultIdx < HSTACK_RESULT.length && hstackP > resultIdx / HSTACK_RESULT.length) {
                const row = HSTACK_RESULT[resultIdx];
                const vals = [row.sku, row.name, row.sku, String(row.price)];
                return {t: vals[c - 6], al: c === 9 ? 'r' : 'l', color: '#107C41'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={phase2 ? {r1: 11, c1: 6, r2: 11, c2: 6} : {r1: 11, c1: 1, r2: 11, c2: 1}}
          active={phase2 ? {r: 11, c: 6} : {r: 11, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* VSTACK result border */}
          {vstackP > 0.05 ? (
            <Neon x={cellCenter(12, 1, {colW}).x - colW(1) / 2} y={cellCenter(12, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3)} h={XL.rowH * 8} color={C.blue} p={vstackP * (1 - prog(f, t(40), 12))} label="=VSTACK result" labelBelow />
          ) : null}
          {/* HSTACK result border */}
          {phase2 && hstackP > 0.05 ? (
            <Neon x={cellCenter(12, 6, {colW}).x - colW(6) / 2} y={cellCenter(12, 6, {colW}).y - XL.rowH / 2} w={colW(6) + colW(7) + colW(8) + colW(9)} h={XL.rowH * 4} color={C.green} p={hstackP * (1 - prog(f, t(40), 12))} label="=HSTACK result" labelBelow />
          ) : null}
          {/* Source highlights */}
          {!phase2 ? (
            <>
              <Neon x={cellCenter(2, 1, {colW}).x - colW(1) / 2} y={cellCenter(2, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3)} h={XL.rowH * 4} color={C.blue} p={0.2} label="tbl_Cairo" labelBelow />
              <Neon x={cellCenter(7, 1, {colW}).x - colW(1) / 2} y={cellCenter(7, 1, {colW}).y - XL.rowH / 2} w={colW(1) + colW(2) + colW(3)} h={XL.rowH * 4} color={C.amber} p={0.2} label="tbl_Alex" labelBelow />
            </>
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={c >= t(18) ? C.green : C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Lesson counter */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 27 من 76 · ختام الوحدة 5</div>
      </div>

      <TopBadge text="الدرس 27 من 76 | ختام الوحدة 5 ──► Multi-Source Integration Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="VSTACK & HSTACK ──► =VSTACK(Range1, Range2) / =HSTACK(Range1, Range2)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
