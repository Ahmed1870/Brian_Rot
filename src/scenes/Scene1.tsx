import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, MONO, SCENES, START, TOTAL_LESSONS, UNIT, TOTAL_UNITS} from '../theme';
import {SALES_RAW, UNIQUE_CATEGORIES, salesCell} from '../data';
import {
  CAM0, Caption, Cursor, ExcelApp, ExcelWindow, Neon, Ripple, Stage, TopBadge, XL, camLerp, cellCenter, clamp, dwell, geo, prog, sec, track, typed,
} from '../kit';

// SC01: UNIQUE — typed formula extracts distinct categories from raw sales.
// Single Excel window (no split). Raw data in A:D, UNIQUE result in F.
const S = START.s1;
const t = (g: number) => sec(g - S);

const colW = (c: number) => [0, 130, 110, 120, 100, 160][c] ?? XL.colW;
const FORMULA = '=UNIQUE(tbl_Sales[Category])';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camLerp(CAM0, {fx: 480, fy: 280, z: 1.0}, prog(f, t(2), 30));

  // Typing animation in formula bar (3s to 9s)
  const typedFormula = typed(FORMULA, f, t(3.0), 1.0);
  const typingDone = f >= t(9.0);

  // Spill progress: unique categories fill F2 downward (9.5s onwards)
  const spillP = typingDone ? prog(f, t(9.5), 16) : 0;
  const filledRows = Math.floor(spillP * UNIQUE_CATEGORIES.length);

  const fbEdit = f >= t(3.0) && f < t(9.5);

  // Cursor: F2 → formula bar → Enter
  const f2 = cellCenter(2, 6, {colW});
  const fbY = geo(1, 0, 1).fbTop + 14;
  const pts = dwell([
    {f: t(0), x: 900, y: 330},
    {f: t(2.5), x: f2.x, y: f2.y},
    {f: t(3.0), x: 200, y: fbY},
    {f: t(9.0), x: f2.x, y: f2.y},
    {f: t(11), x: 900, y: 330},
  ]);
  const cur = track(f, pts);
  const clicks = [2.5, 3.0, 9.0];
  const curHide = f > t(12);
  const down = clicks.some((c) => f >= t(c) && f < t(c) + 4);

  const g0 = geo(1, 0, 1);

  return (
    <Stage dur={SCENES.s1.dur} inFx="fade" outFx="fade">
      <ExcelWindow cam={cam}>
        <ExcelApp
          file="Sales.xlsx" nameBox={typingDone ? 'F2' : 'A1'} formula={typedFormula} fbEdit={fbEdit}
          cell={(r, c) => {
            // Raw sales data in columns A-D (1-4)
            if (c <= 4) return salesCell(r, c) as any;
            // Column F (6): UNIQUE result
            if (c === 6) {
              if (r === 1) return {t: 'Category (Unique)', b: true, bg: '#DBEAFE', al: 'l', color: '#1E40AF'};
              const idx = r - 2;
              if (idx < filledRows && idx < UNIQUE_CATEGORIES.length) {
                return {t: UNIQUE_CATEGORIES[idx], color: '#1E40AF'};
              }
              return undefined;
            }
            return undefined;
          }} colW={colW}
          sel={typingDone ? {r1: 2, c1: 6, r2: 2, c2: 6} : {r1: 1, c1: 1, r2: 1, c2: 1}}
          active={typingDone ? {r: 2, c: 6} : {r: 1, c: 1}}
          thumb={0} thumbSize={0.55}
        >
          {/* Source data highlight */}
          <Neon x={cellCenter(1, 1, {colW}).x - colW(1) / 2} y={g0.rowsTop} w={colW(1)} h={XL.rowH * (SALES_RAW.length + 1)} color={C.amber} p={prog(f, t(2), 12) * 0.3 * (1 - prog(f, t(40), 12))} label="Source: tbl_Sales[Category]" labelBelow />
          {/* Spill border on UNIQUE result */}
          {spillP > 0.05 ? (
            <Neon x={cellCenter(2, 6, {colW}).x - colW(6) / 2} y={cellCenter(2, 6, {colW}).y - XL.rowH / 2} w={colW(6)} h={XL.rowH * UNIQUE_CATEGORIES.length} color={C.blue} p={spillP * (1 - prog(f, t(40), 12))} label="=UNIQUE result (spill)" labelBelow />
          ) : null}
          {/* Click ripples */}
          {clicks.map((c) => { const cp = track(t(c), pts); return <Ripple key={c} x={cp.x} y={cp.y} f={f} at={t(c)} color={C.blue} />; })}
          <Cursor x={cur.x} y={cur.y} down={down} hide={curHide} />
        </ExcelApp>
      </ExcelWindow>

      {/* Lesson counter */}
      <div style={{position: 'absolute', right: 56, top: 80, opacity: prog(f, t(1), 12)}}>
        <div style={{fontFamily: MONO, fontSize: 16, color: C.muted, textAlign: 'right'}}>الدرس 34 من 76 · الوحدة 7 من 14</div>
      </div>

      <TopBadge text="الدرس 34 من 76 | الوحدة 7 من 14 ──► UNIQUE & SORT Engine" from={t(2.0)} to={t(18.0)} />
      <Caption text="Dynamic Extraction ──► =UNIQUE(tbl_Sales[Category]) (Zero Manual Copy/Paste)" from={t(18.0)} to={t(39.0)} />
    </Stage>
  );
};
